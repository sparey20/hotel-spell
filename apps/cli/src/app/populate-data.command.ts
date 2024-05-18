import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Command, CommandRunner, Option } from 'nest-commander';
import { firstValueFrom } from 'rxjs';
import { addDays } from 'date-fns';
import * as dotenv from 'dotenv';
dotenv.config();

interface PopulateDataCommandOptions {
  count: number;
  hotel: string;
}

@Command({
  name: 'populate-data',
})
export class PopulateDataCommand extends CommandRunner {
  constructor(private httpService: HttpService) {
    super();
  }

  async run(
    inputs: string[],
    options: PopulateDataCommandOptions
  ): Promise<void> {
    const count = options.count ?? 1;

    if (!options.hotel) {
      console.log('Must provide a hotel ID');
      return;
    }

    const generatedReservations: AxiosResponse<
      {
        checkInDate: string;
        stayDays: number;
        firstName: string;
        lastName: string;
        email: string;
      }[]
    > = await firstValueFrom(
      this.httpService.get(
        `https://api.mockaroo.com/api/${process.env.MOCKAROO_RESERVATION_ROUTE}`,
        {
          params: {
            key: process.env.MOCKAROO_API_KEY,
            count,
          },
        }
      )
    );
    const rooms: AxiosResponse<any[]> = await firstValueFrom(
      this.httpService.get('http://localhost:3000/api/rooms', {
        params: {
          hotel: options.hotel,
        },
      })
    );
    const createdReservations = [];

    for (const reservationData of generatedReservations.data) {
      const { checkInDate, stayDays, firstName, lastName, email } =
        reservationData;

      try {
        const createdReservation = await firstValueFrom(
          this.httpService.post('http://localhost:3000/api/reservations', {
            firstName,
            lastName,
            email,
            checkInDate,
            checkOutDate: addDays(new Date(checkInDate), stayDays)
              .toISOString()
              .split('T')[0],
            roomNumber:
              rooms.data[Math.floor(Math.random() * rooms.data.length)].number,
          })
        );

        createdReservations.push(createdReservation.data);
      } catch (error) {
        console.error('Error creating reservation', error);
      }
    }

    console.log('Total created reservations: ', createdReservations.length);
  }

  @Option({
    flags: '-c, --count [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-h, --hotel [string]',
  })
  parse(val: string): string {
    return val;
  }
}

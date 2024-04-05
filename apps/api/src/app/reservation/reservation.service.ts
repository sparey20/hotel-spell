import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>
  ) {}

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!reservation) {
      throw new NotFoundException();
    }

    return reservation;
  }

  async findAll() {
    try {
      const reservations = await this.reservationRepository.find({
        where: {
          room: {
            hotel: {
              id: '1d7a53dd-b5a6-4efd-9494-7c776c6ea241',
            },
          },
        },
        relations: {
          room: true,
          guest: true,
        },
      });

      return reservations;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { format } from 'date-fns';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>
  ) {}

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOneBy({ id });

    if (!guest) {
      throw new NotFoundException();
    }

    return guest;
  }

  async findOneByEmail(email: string): Promise<Guest> {
    const guest = await this.guestRepository.findOneBy({ email });

    if (!guest) {
      throw new NotFoundException();
    }

    return guest;
  }

  async create(createGuestDto: CreateGuestDto) {
    const { firstName, lastName, email } = createGuestDto;
    const guest = new Guest();

    guest.firstName = firstName;
    guest.lastName = lastName;
    guest.email = email;

    return this.guestRepository.save(guest);
  }

  async findAll(guestQueryParams: { hotelId: string; isActive: boolean }) {
    const { hotelId, isActive } = guestQueryParams;
    const today = format(new Date(), 'P');

    try {
      const guests = await this.guestRepository.find({
        where: {
          reservation: {
            room: {
              hotel: {
                id: hotelId,
              },
            },
            ...(isActive ? { checkInDate: MoreThanOrEqual(today) } : {}),
          },
        },
        relations: {
          reservation: true,
        },
      });

      return guests;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

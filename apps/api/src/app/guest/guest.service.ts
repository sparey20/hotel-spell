import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';

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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';

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
}

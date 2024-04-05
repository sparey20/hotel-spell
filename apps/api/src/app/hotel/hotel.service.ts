import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async findOne(id: string): Promise<any> {
    const hotel = await this.hotelRepository.findOneBy({ id });

    if (!hotel) {
      throw new NotFoundException();
    }

    return hotel;
  }

  async findHotelUsers(id: string) {
    try {
      const hotel = await this.hotelRepository.findOne({
        where: {
          id,
        },
        relations: {
          users: true,
        },
      });

      if (!hotel) {
        throw new NotFoundException();
      }

      return hotel.users;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

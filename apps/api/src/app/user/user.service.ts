import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Hotel } from '../hotel/hotel.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findUserHotel(id: string): Promise<Hotel> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          hotel: true,
        },
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user.hotel;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}

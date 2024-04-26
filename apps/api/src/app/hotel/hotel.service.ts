import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find()
  }

  async findOne(id: string): Promise<Hotel> {
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

  async create(createHotelDto: CreateHotelDto) {
    const hotel = new Hotel();
    const {name, description, address, city, state, postal} = createHotelDto;

    hotel.name = name;
    hotel.description = description;
    hotel.address = address;
    hotel.city = city;
    hotel.state = state;
    hotel.postal = postal;

    return this.hotelRepository.save(hotel);
  }
}

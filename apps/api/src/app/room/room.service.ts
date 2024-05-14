import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateHotelDto } from '../hotel/dto/create-hotel.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { HotelService } from '../hotel/hotel.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private hotelService: HotelService
  ) {}

  async findAll(hotelId: string): Promise<Room[]> {
    return this.roomRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
      },
      order: {
        number: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException();
    }

    return room;
  }

  async findOneByRoomNumber(number: number): Promise<Room> {
    const room = await this.roomRepository.findOneBy({ number });

    if (!room) {
      throw new NotFoundException();
    }

    return room;
  }

  async create(createRoomDto: CreateRoomDto) {
    const { number, hotelId } = createRoomDto;

    let hotel = null;

    try {
      hotel = await this.hotelService.findOne(hotelId);
    } catch (error) {
      throw new BadRequestException('Hotel not found');
    }

    const room = new Room();

    room.number = number;
    room.hotel = hotel;

    return this.roomRepository.save(room);
  }
}

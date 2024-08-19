import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HotelService } from '../hotel/hotel.service';
import { RoomTypeService } from '../roomType/roomType.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly roomTypeService: RoomTypeService,
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
      relations: ['roomType'],
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

  async create({ number, hotelId, roomTypeId }: CreateRoomDto): Promise<Room> {
    const [hotel, roomType] = await Promise.all([
      this.hotelService.findOne(hotelId).catch(() => {
        throw new BadRequestException('Hotel not found');
      }),
      this.roomTypeService.findOne(roomTypeId).catch(() => {
        throw new BadRequestException('Room type not found');
      }),
    ]);

    const room = new Room();
    room.number = number;
    room.hotel = hotel;
    room.roomType = roomType;

    return this.roomRepository.save(room);
  }

  async update(
    roomId: string,
    { number, hotelId, roomTypeId }: UpdateRoomDto
  ): Promise<Room> {
    const [room, hotel, roomType] = await Promise.all([
      this.findOne(roomId).catch(() => {
        throw new BadRequestException('Room not found');
      }),
      this.hotelService.findOne(hotelId).catch(() => {
        throw new BadRequestException('Hotel not found');
      }),
      this.roomTypeService.findOne(roomTypeId).catch(() => {
        throw new BadRequestException('Room type not found');
      }),
    ]);

    room.number = number;
    room.hotel = hotel;
    room.roomType = roomType;

    this.roomRepository.update(roomId, room);

    return room;
  }

  async delete(roomId: string): Promise<void> {
    await this.roomRepository.delete(roomId);
  }
}

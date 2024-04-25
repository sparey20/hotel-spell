import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}

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

  async findHotelReservations(hotelId: string) {
    return this.roomRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
      },
      relations: ['reservation'],
    });
  }
}

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Room } from './room.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HotelService } from '../hotel/hotel.service';
import { RoomTypeService } from '../roomType/roomType.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomFindParams } from './interfaces';
import { Reservation } from '../reservation/reservation.entity';
import { start } from 'repl';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly roomTypeService: RoomTypeService,
    private hotelService: HotelService
  ) {}

  async findAll({
    hotelId,
    search,
    sortColumn,
    sortDirection,
    page,
    limit,
  }: RoomFindParams): Promise<Pagination<Room>> {
    if (!hotelId) {
      throw new BadRequestException('No hotel provided');
    }

    try {
      return paginate(
        this.roomRepository,
        { page, limit },
        {
          where: {
            hotel: {
              id: hotelId,
            },
            ...(search && !isNaN(Number(search))
              ? { number: Number(search) }
              : {}),
          },
          order: {
            ...(sortColumn
              ? { [sortColumn]: sortDirection?.toUpperCase() ?? 'ASC' }
              : {}),
            id: 'ASC',
          },
          relations: {
            roomType: true,
          },
        }
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAvailableRooms(
    hotelId: string,
    startDate: string,
    endDate: string,
    roomTypeId: string
  ) {
    const query = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.reservations', 'reservation')
      .leftJoin('room.hotel', 'hotel')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .where('hotel.id = :hotelId', { hotelId })
      .andWhere(
        'reservation.id is NULL OR NOT (reservation.checkInDate <= :endDate AND reservation.checkOutDate >= :startDate)',
        { startDate, endDate }
      );

    if (roomTypeId) {
      query.andWhere('room.roomType.id = :roomTypeId', { roomTypeId });
    }

    const rooms = query.getMany();

    return rooms;
  }

  async getOccupancy(
    hotelId: string,
    date: string
  ): Promise<{ occupancy: string }> {
    const totalRooms = await this.roomRepository.count();
    const roomsOccupied = await this.roomRepository.count({
      where: {
        hotel: {
          id: hotelId,
        },
        reservations: {
          checkInDate: LessThanOrEqual(date),
          checkOutDate: MoreThanOrEqual(date),
        },
      },
      relations: {
        hotel: true,
        reservations: true,
      },
    });

    return {
      occupancy: ((roomsOccupied / totalRooms) * 100).toFixed(2),
    };
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

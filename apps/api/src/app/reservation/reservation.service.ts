import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GuestService } from '../guest/guest.service';
import { RoomService } from '../room/room.service';
import { format } from 'date-fns';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private guestService: GuestService,
    private roomService: RoomService
  ) {}

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({
      id,
    });

    if (!reservation) {
      throw new NotFoundException();
    }

    return reservation;
  }

  async findAll(
    reservationParams: {
      hotelId: string;
      checkInDate?: string;
      checkOutDate?: string;
      isActive?: boolean;
    } = { hotelId: null, checkInDate: '', checkOutDate: '', isActive: false }
  ) {
    const { hotelId, isActive, checkInDate, checkOutDate } = reservationParams;
    const today = format(new Date(), 'P');

    if (!hotelId) {
      throw new BadRequestException('No hotel provided');
    }

    try {
      const reservations = await this.reservationRepository.find({
        where: {
          room: {
            hotel: {
              id: hotelId,
            },
          },
          ...(isActive || (!isActive && !checkInDate)
            ? {}
            : { checkInDate: MoreThanOrEqual(checkInDate) }),
          ...(!isActive && !checkOutDate
            ? {}
            : {
                checkOutDate: isActive
                  ? MoreThanOrEqual(today)
                  : LessThanOrEqual(checkOutDate),
              }),
        },
        relations: {
          room: true,
          guest: true,
        },
      });

      return reservations;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async create(createUserDto: CreateReservationDto) {
    const {
      email,
      firstName,
      lastName,
      roomNumber,
      checkInDate,
      checkOutDate,
    } = createUserDto;
    const reservation = new Reservation();
    let guest = null;
    let room = null;

    try {
      guest = await this.guestService.findOneByEmail(email);
    } catch (error) {
      guest = await this.guestService.create({ firstName, lastName, email });
    }

    try {
      room = await this.roomService.findOneByRoomNumber(roomNumber);
    } catch (error) {
      throw new BadRequestException('Room not found');
    }

    reservation.guest = guest;
    reservation.room = room;
    reservation.checkInDate = checkInDate;
    reservation.checkOutDate = checkOutDate;

    return this.reservationRepository.save(reservation);
  }
}

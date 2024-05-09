import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  ILike,
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
import { format, isBefore } from 'date-fns';
import { Guest } from '../guest/guest.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private entityManager: EntityManager,
    private guestService: GuestService,
    private roomService: RoomService
  ) {}

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
      },
      relations: ['guest'],
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
      search?: string;
      room?: number;
    } = {
      hotelId: null,
      checkInDate: '',
      checkOutDate: '',
      isActive: false,
      search: '',
      room: null,
    }
  ) {
    const { hotelId, isActive, checkInDate, checkOutDate, search, room } =
      reservationParams;
    const today = format(new Date(), 'P');

    console.log('search', search);

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
          ...(search
            ? {
                guest: {
                  email: ILike(`%${search}%`),
                },
              }
            : {}),
          ...(room
            ? {
                room: {
                  number: room,
                },
              }
            : {}),
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

  async update(
    reservationId: string,
    updateUserDto: CreateReservationDto = {
      email: null,
      firstName: null,
      lastName: null,
      roomNumber: null,
      checkInDate: null,
      checkOutDate: null,
    }
  ) {
    const today = format(new Date(), 'P');
    const {
      email,
      firstName,
      lastName,
      roomNumber,
      checkInDate,
      checkOutDate,
    } = updateUserDto;

    if (checkInDate && isBefore(checkInDate, today)) {
      throw new BadRequestException('Cannot set check in date in the past');
    }

    const reservation = await this.findOne(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const guest = reservation.guest;

    if (firstName) {
      guest.firstName = firstName;
    }

    if (lastName) {
      guest.lastName = lastName;
    }

    if (email) {
      guest.email = email;
    }

    if (roomNumber) {
      reservation.room.number = roomNumber;
    }

    if (checkInDate) {
      reservation.checkInDate = checkInDate;
    }

    if (checkOutDate) {
      reservation.checkOutDate = checkOutDate;
    }

    await this.entityManager.transaction(async (transactionEntityManager) => {
      if (firstName || lastName || email) {
        await transactionEntityManager.save(guest);
      }

      await transactionEntityManager.save(reservation);

      return reservation;
    });
  }
}

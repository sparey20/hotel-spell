import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { Room } from '../room/room.entity';
import { UpdateReservationDto } from './dto/update-reservation.dto';

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
      relations: ['guest', 'room'],
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

  async create(createReservationDto: CreateReservationDto) {
    const {
      email,
      firstName,
      lastName,
      roomNumber,
      checkInDate,
      checkOutDate,
    } = createReservationDto;
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
    updateReservationDto: Partial<UpdateReservationDto> = {
      email: null,
      firstName: null,
      lastName: null,
      roomNumber: null,
      checkInDate: null,
      checkOutDate: null,
    }
  ) {
    const today = format(new Date(), 'P');
    const reservation = await this.findOne(reservationId);

    if (updateReservationDto.checkInDate && isBefore(updateReservationDto.checkInDate, today)) {
      throw new BadRequestException('Cannot set check in date in the past');
    }

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const {roomNumber, checkInDate, checkOutDate, ...guestUpdate} = updateReservationDto;
    const guest = reservation.guest;
    let room = reservation.room;

    if (roomNumber) {
      room = await this.roomService.findOneByRoomNumber(roomNumber);
    }

    if (room) {
      reservation.room = room;
    }

    reservation.checkInDate = checkInDate ?? reservation.checkInDate;
    reservation.checkOutDate = checkOutDate ?? reservation.checkOutDate;
    reservation.room = room;
    guest.email = guestUpdate?.email ?? guest.email;
    guest.firstName = guestUpdate.firstName ?? guest.firstName;
    guest.lastName = guestUpdate.lastName ?? guest.lastName;

    try {
      await this.entityManager.transaction(async (transactionEntityManager) => {
        if (Object.keys(guestUpdate).length > 0) {
          await transactionEntityManager.save(guest);
        }
  
        await transactionEntityManager.save(reservation);
      });
    } catch(error) {
      throw new InternalServerErrorException('Unable to complete reservation update.')
    }
    

    return reservation;
  }

  async delete(reservationId: string) {
    await this.reservationRepository.delete(reservationId);
  }
}

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
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { GuestService } from '../guest/guest.service';
import { RoomService } from '../room/room.service';
import {
  addDays,
  differenceInDays,
  format,
  isBefore,
  isWithinInterval,
  nextDay,
} from 'date-fns';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationFindParams } from './interfaces/reservation-find-params';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

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
    reservationParams: ReservationFindParams
  ): Promise<Pagination<Reservation>> {
    const {
      hotelId,
      isActive,
      search,
      room,
      sortColumn,
      sortDirection,
      ...paginationOptions
    } = reservationParams;
    const today = format(new Date(), 'P');

    if (!hotelId) {
      throw new BadRequestException('No hotel provided');
    }

    try {
      return paginate(this.reservationRepository, paginationOptions, {
        where: {
          room: {
            hotel: {
              id: hotelId,
            },
          },
          ...(!isActive ? {} : { checkInDate: LessThanOrEqual(today) }),
          ...(!isActive
            ? {}
            : {
                checkOutDate: MoreThanOrEqual(today),
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
        order: {
          ...(sortColumn
            ? { [sortColumn]: sortDirection?.toUpperCase() ?? 'ASC' }
            : {}),
          updatedDate: 'DESC',
        },
        relations: {
          room: true,
          guest: true,
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async create(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    const {
      email,
      firstName,
      lastName,
      roomNumber,
      checkInDate,
      checkOutDate,
      status,
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
    reservation.status = status;

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
  ): Promise<Reservation> {
    const today = format(new Date(), 'P');
    const reservation = await this.findOne(reservationId);

    if (
      updateReservationDto.checkInDate &&
      isBefore(updateReservationDto.checkInDate, today)
    ) {
      throw new BadRequestException('Cannot set check in date in the past');
    }

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const { roomNumber, checkInDate, checkOutDate, ...guestUpdate } =
      updateReservationDto;
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
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to complete reservation update.'
      );
    }

    return reservation;
  }

  async delete(reservationId: string): Promise<void> {
    await this.reservationRepository.delete(reservationId);
  }

  async calculateReservationsByDay(
    calculateReservationsByDayParams
  ): Promise<any> {
    const { hotelId, startDate, endDate } = calculateReservationsByDayParams;

    if (!hotelId) {
      throw new BadRequestException('No hotel provided');
    }

    if (!startDate || !endDate) {
      throw new BadRequestException('No valid date range provided');
    }

    const reservationsInRange = await this.reservationRepository.find({
      where: {
        room: {
          hotel: {
            id: hotelId,
          },
        },
        checkInDate: LessThan(endDate),
        checkOutDate: MoreThanOrEqual(startDate),
      },
      relations: {
        room: true,
      },
    });

    const dayDifference = differenceInDays(endDate, startDate);
    const result = {};

    for (let i = 0; i < dayDifference; i++) {
      const date = addDays(new Date(startDate), i);

      const reservationsOnThatDay = reservationsInRange.filter(
        (reservation) => {
          return isWithinInterval(date, {
            start: new Date(reservation.checkInDate),
            end: new Date(reservation.checkOutDate),
          });
        }
      ).length;

      result[format(date, 'P')] = reservationsOnThatDay;
    }

    return result;
  }
}

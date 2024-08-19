import { IsString, IsEmail, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { RoomStatus } from '../../room/room.entity';
import { ReservationStatus } from '../reservation.entity';

export class UpdateReservationDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  roomNumber: number;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;

  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}

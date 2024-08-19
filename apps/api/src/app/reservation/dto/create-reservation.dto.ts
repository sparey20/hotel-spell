import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ReservationStatus } from '../reservation.entity';

export class CreateReservationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  roomNumber: number;

  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}

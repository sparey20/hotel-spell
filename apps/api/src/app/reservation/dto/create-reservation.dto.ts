import { IsString, IsEmail, IsNumber, IsDateString } from 'class-validator';

export class CreateReservationDto {
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
}

import { IsEmail, IsString } from 'class-validator';

export class CreateGuestDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

import { IsNumber, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
  
  @IsString()
  address: string;

  @IsNumber()
  postal: number;

  @IsString()
  city: string;

  @IsString()
  state: string;
}

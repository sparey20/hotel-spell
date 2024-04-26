import { IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  number: number;

  @IsString()
  hotelId: string;
}

import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { RoomStatus } from '../room.entity';

export class CreateRoomDto {
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;

  @IsUUID()
  @IsNotEmpty()
  roomTypeId: string;
}

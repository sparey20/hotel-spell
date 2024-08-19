import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { RoomStatus } from '../room.entity';

export class UpdateRoomDto {
  @IsNumber()
  number: number;

  @IsUUID()
  hotelId: string;

  @IsEnum(RoomStatus)
  status: RoomStatus;

  @IsUUID()
  roomTypeId: string;
}

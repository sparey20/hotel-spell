import { RoomStatus } from "./room.interface";

export interface ICreateRoomDTO {
	number: number;
	status: RoomStatus;
	roomTypeId: string;
}

export interface IUpdateRoomDTO {
  number: number;
  status: RoomStatus;
  roomTypeId: string;
}
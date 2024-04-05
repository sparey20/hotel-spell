import { IGuest } from './guest.interface';
import { IRoom } from './room.interface';

export interface IReservation {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  createdDate: string;
  updatedDate: string;
  room: IRoom;
  guest: IGuest;
}

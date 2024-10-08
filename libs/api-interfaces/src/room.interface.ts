import { IRoomType } from "./roomType.interface";

export enum RoomStatus {
  NEEDS_CLEANING = 'needsCleaning',
  NEEDS_SERVICING = 'needsServicing',
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

export interface IRoom {
  id: string;
  number: number;
  roomType: IRoomType;
  status: RoomStatus;
}

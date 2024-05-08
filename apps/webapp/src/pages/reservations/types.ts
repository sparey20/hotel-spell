import { IRoom } from '@hotel-spell/api-interfaces';
import { ReservationActionsTypes } from './enums';

export type ReservationTableItem = {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  roomNumber: number;
  checkInDate: string;
  checkOutDate: string;
};

export type ReservationAction = {
  type: ReservationActionsTypes;
  payload: ReservationState;
};

export type ReservationStateData = {
  reservations: ReservationTableItem[] | ReservationTableItem;
  rooms: IRoom[];
};

export type ReservationState = {
  loading: boolean;
  error: boolean;
  data: ReservationStateData;
};

export type ReservationModalFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  roomNumber: number;
  checkInDate: string;
  checkOutDate: string;
  id: string;
}
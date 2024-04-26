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

export type ReservationState = {
  loading: boolean;
  error: boolean;
  data: ReservationTableItem[] | ReservationTableItem;
};

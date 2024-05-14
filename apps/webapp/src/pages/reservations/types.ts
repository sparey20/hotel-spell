import { IRoom } from '@hotel-spell/api-interfaces';
import { ReservationActionsTypes } from './enums';

export type ReservationTableItem = {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
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
  pagination: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  rooms: IRoom[];
};

export type ReservationState = {
  loading: boolean;
  error: boolean;
  search: string;
  sorting: {
    column: string;
    direction: 'asc' | 'desc';
  };
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
};

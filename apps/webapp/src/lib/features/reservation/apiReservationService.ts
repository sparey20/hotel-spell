import axios from 'axios';
import { BASE_API_PATH } from '../../constants/base-api-path';

export type GetReservationParams = {
  hotel: string;
  limit?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  page?: number;
  isActive?: boolean;
};

export type ReservationDTO = {
  firstName: string;
  lastName: string;
  email: string;
  roomNumber: number;
  checkInDate: string;
  checkOutDate: string;
  id: string;
};

const reservationApiPrefix = `${BASE_API_PATH}/api/reservations`;

export const getReservations = (params: GetReservationParams) => {
  return axios.get(reservationApiPrefix, { params });
};

export const createReservation = (createReservationDTO: ReservationDTO) => {
  return axios.post(reservationApiPrefix, createReservationDTO);
};

export const updateReservation = (
  id: string,
  reservationForm: ReservationDTO
) => {
  return axios.patch(`${reservationApiPrefix}/${id}`, reservationForm);
};

export const deleteReservation = (id: string) => {
  return axios.delete(`${reservationApiPrefix}/${id}`);
};

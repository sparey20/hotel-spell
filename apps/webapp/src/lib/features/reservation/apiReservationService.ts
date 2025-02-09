import axios, { AxiosResponse } from 'axios';
import { BASE_API_PATH } from '../../constants/baseApiPath';
import { IAPIListView, IReservation } from '@hotel-spell/api-interfaces';

export type GetReservationParams = {
  hotel: string;
  limit?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  page?: number;
  date?: string;
};

export type ReservationDTO = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  roomNumber: number | null;
  checkInDate: string | null;
  checkOutDate: string | null;
};

export type GetReservationByDayParams = {
  hotel: string;
  startDate: string;
  endDate: string;
};

export type GetCheckingByDayParams = {
  hotel: string;
  date: string;
};

const reservationApiPrefix = `${BASE_API_PATH}/api/reservations`;

export const getReservations = (params: GetReservationParams): Promise<AxiosResponse<IAPIListView<IReservation>>> => {
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

export const getReservationsByDay = (params: GetReservationByDayParams) => {
  return axios.get(`${reservationApiPrefix}/by-day`, { params });
};

export const getCheckingIn = (params: GetCheckingByDayParams) => {
  return axios.get(`${reservationApiPrefix}/checking-in-by-day`, { params });
};

export const getCheckingOut = (params: GetCheckingByDayParams) => {
  return axios.get(`${reservationApiPrefix}/checking-out-by-day`, { params });
};

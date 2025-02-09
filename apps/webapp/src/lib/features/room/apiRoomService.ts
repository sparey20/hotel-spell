import axios, { AxiosResponse } from 'axios';
import { BASE_API_PATH } from '../../constants/baseApiPath';
import {
  IAPIListView,
  ICreateRoomDTO,
  IRoom,
  IUpdateRoomDTO,
} from '@hotel-spell/api-interfaces';

const apiRoomsPrefix = `${BASE_API_PATH}/api/rooms`;

export type GetRoomsParams = {
  hotel: string;
  limit?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  page?: number;
};

export type getAvailableRoomsParams = {
  hotel: string;
  startDate: string,
  endDate: string,
  roomTypeId: string;
}

export type getOccupancyParams = {
  hotel: string;
  date: string,
}

export const getRooms = (
  params: GetRoomsParams
): Promise<AxiosResponse<IAPIListView<IRoom>>> => {
  return axios.get(apiRoomsPrefix, { params });
};

export const getAvailableRooms = (
  params: getAvailableRoomsParams
): Promise<AxiosResponse<IRoom[]>> => {
  return axios.get(`${apiRoomsPrefix}/availableRooms`, { params });
};

export const getOccupancy = (
  params: getOccupancyParams
): Promise<AxiosResponse<{occupancy: string}>> => {
  return axios.get(`${apiRoomsPrefix}/occupancy`, { params });
};

export const createRoom = (
  createRoomDTO: ICreateRoomDTO
): Promise<AxiosResponse<IRoom>> => {
  return axios.post(apiRoomsPrefix, createRoomDTO);
};

export const editRoom = (
  id: string,
  updateRoomDTO: IUpdateRoomDTO
): Promise<AxiosResponse<IRoom>> => {
  return axios.patch(`${apiRoomsPrefix}/${id}`, updateRoomDTO);
};

export const deleteRoom = (id: string): Promise<AxiosResponse<void>> => {
  return axios.delete(`${apiRoomsPrefix}/${id}`);
};

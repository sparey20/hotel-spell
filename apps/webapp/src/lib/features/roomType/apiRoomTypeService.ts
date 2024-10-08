import axios, { AxiosResponse } from 'axios';
import { BASE_API_PATH } from '../../constants/baseApiPath';
import { IRoomType } from '@hotel-spell/api-interfaces';

const apiRoomsPrefix = `${BASE_API_PATH}/api/roomTypes`;

export type GetRoomsParams = {
  hotel: string;
};

export const getRoomTypes = (
  params: GetRoomsParams
): Promise<AxiosResponse<IRoomType[]>> => {
  return axios.get(apiRoomsPrefix, { params });
};
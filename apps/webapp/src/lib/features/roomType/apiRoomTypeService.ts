import axios, { AxiosResponse } from 'axios';
import { BASE_API_PATH } from '../../constants/baseApiPath';
import { IRoomType } from '@hotel-spell/api-interfaces';

const apiRoomsPrefix = `${BASE_API_PATH}/api/roomTypes`;

export type GetRoomsTypesParams = {
  hotel: string;
};

export const getRoomTypes = (
  params: GetRoomsTypesParams
): Promise<AxiosResponse<IRoomType[]>> => {
  return axios.get(apiRoomsPrefix, { params });
};
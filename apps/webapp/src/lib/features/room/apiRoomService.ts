import axios from 'axios';
import { BASE_API_PATH } from '../../constants/base-api-path';

const apiRoomsPrefix = `${BASE_API_PATH}/api/rooms`;

export type GetRoomsParams = {
  hotel: string;
};

export const getRooms = (params: GetRoomsParams) => {
  return axios.get(apiRoomsPrefix, { params });
};

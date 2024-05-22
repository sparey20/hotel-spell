import axios from 'axios';

const apiRoomsPrefix = '/api/rooms';

export type GetRoomsParams = {
  hotel: string;
};

export const getRooms = (params: GetRoomsParams) => {
  return axios.get(apiRoomsPrefix, { params });
};

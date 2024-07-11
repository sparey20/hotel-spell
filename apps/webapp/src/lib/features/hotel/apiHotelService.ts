import axios from 'axios';
import { BASE_API_PATH } from '../../constants/base-api-path';

const reservationApiPrefix = `${BASE_API_PATH}/api/hotels`;

export const getHotels = () => {
  return axios.get(reservationApiPrefix);
};

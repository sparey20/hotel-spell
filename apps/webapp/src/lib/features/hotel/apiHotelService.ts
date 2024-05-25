import axios from 'axios';

const reservationApiPrefix = '/api/hotels';

export const getHotels = () => {
  return axios.get(reservationApiPrefix);
};

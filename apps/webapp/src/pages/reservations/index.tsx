import { IHotel, IReservation } from '@hotel-spell/api-interfaces';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import hotelSlice from '../../lib/features/hotel/hotelSlice';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { wrapper } from '../../lib/store';
import styles from './index.module.scss';
import Table from '../../components/table/table';

/* eslint-disable-next-line */
export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {
  const { hotel } = useAppSelector((state) => state.hotel);
  const [reservations, setReservations] = useState<IReservation[]>([]);

  const dispatch = useAppDispatch();

  const getReservations = () => {
    axios
      .get('/api/reservations')
      .then(({ data }: AxiosResponse<IReservation[]>) => {
        setReservations(data);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <div className={styles.reservations}>
      <h1>Reservations</h1>
      <Table rows={reservations}></Table>
    </div>
  );
}

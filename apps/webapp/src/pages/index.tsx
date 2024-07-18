import { IHotel, IReservation } from '@hotel-spell/api-interfaces';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import * as apiReservationService from '../lib/features/reservation/apiReservationService';
import * as apiRoomService from '../lib/features/room/apiRoomService';
import axios from 'axios';
import { isToday } from 'date-fns';

export function Index() {
  const [currentGuests, setCurrentGuests] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [guestsCheckingOut, setGuestsCheckingOut] = useState([] as string[]);
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .all([
        apiReservationService.getReservations({
          hotel: hotel?.id as string,
          isActive: true,
          limit: 1000,
        }),
        apiRoomService.getRooms({ hotel: hotel?.id as string }),
      ])
      .then(
        axios.spread((reservationResponse, roomsResponse) => {
          setCurrentGuests(reservationResponse.data.meta.totalItems);
          setOccupancy(
            (reservationResponse.data.meta.totalItems /
              roomsResponse.data.length) *
              100
          );

          const guestsCheckingOut = reservationResponse.data.items.filter(
            (reservation: IReservation) => {
              console.log('date', new Date(reservation.checkOutDate));
              return isToday(new Date(reservation.checkOutDate));
            }
          ).length;

          console.log('guestsCheckingOut', guestsCheckingOut);
        }),
        (error) => {
          console.error(error);
        }
      );
  }, []);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{hotel?.name}</h1>
      </header>
      <section className={styles.body}>
        <div className="flex flex-row gap-3">
          <div className={styles.card}>
            <div className={styles.title}>Guests</div>
            <div className={styles.number}>{currentGuests}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.title}>Occupancy</div>
            <div className={styles.number}>{occupancy}%</div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Index;

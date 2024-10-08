import { IHotel, IReservation } from '@hotel-spell/api-interfaces';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import * as apiReservationService from '../lib/features/reservation/apiReservationService';
import * as apiRoomService from '../lib/features/room/apiRoomService';
import axios from 'axios';
import { addDays, format, isToday, subDays } from 'date-fns';
import {
  Chart as ChartJs,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import NumberStatisticsCard from '../components/number-statistics-card/NumberStatisticsCard';

ChartJs.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

export function Index() {
  const [currentGuests, setCurrentGuests] = useState<number>(0);
  const [occupancy, setOccupancy] = useState(0);
  const [guestsCheckingOut, setGuestsCheckingOut] = useState([] as string[]);
  const [reservationsByDay, setReservationsByDay] = useState(
    [] as { x: string; y: number }[]
  );
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
        apiRoomService.getRooms({ hotel: hotel?.id as string }) as any,
        apiReservationService.getReservationsByDay({
          hotel: hotel?.id as string,
          startDate: format(subDays(new Date(), 90), 'P'),
          endDate: format(new Date(), 'P'),
        }),
      ])
      .then(
        axios.spread(
          (reservationResponse, roomsResponse, reservationsByDayResponse) => {
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

            console.log(
              'reservationsByDayResponse',
              reservationsByDayResponse.data
            );

            const reservationsByDayChartData = Object.entries(
              reservationsByDayResponse.data as Record<string, number>
            ).reduce(
              (
                acc: { x: string; y: number }[],
                [key, value]: [string, number]
              ) => {
                acc.push({
                  x: key,
                  y: value,
                });

                return acc;
              },
              []
            );

            console.log(
              'reservationsByDayChartData',
              reservationsByDayChartData
            );

            setReservationsByDay(reservationsByDayChartData);
          }
        ),
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
          <NumberStatisticsCard
            title="Guests"
            value={currentGuests}
          ></NumberStatisticsCard>
          <NumberStatisticsCard
            title="Occupancy"
            value={occupancy}
            isPercentage
          ></NumberStatisticsCard>
          <div className={styles.card}>
            <Line
              data={{ datasets: [{ data: reservationsByDay, pointRadius: 0 }] }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Reservations Past 90 Days',
                  },
                  legend: {
                    display: false,
                  },
                  colors: {
                    enabled: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </section>
    </section>
  );
}

export default Index;

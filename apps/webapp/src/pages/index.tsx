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
import {
  LuArrowLeft,
  LuArrowLeftToLine,
  LuArrowRightToLine,
  LuUser,
  LuUsers,
  LuUserX,
} from 'react-icons/lu';

ChartJs.register(
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

type DashboardData = {
  currentGuests: number;
  occupancy: number;
  reservationsByDay: { x: string; y: number }[];
  checkingIn: number,
  checkingOut: number,
};

export function Index() {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const dispatch = useAppDispatch();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    currentGuests: 0,
    occupancy: 0,
    reservationsByDay: [],
    checkingIn: 0,
    checkingOut: 0
  });

  const { currentGuests, occupancy, reservationsByDay, checkingIn, checkingOut } = dashboardData;

  useEffect(() => {
    axios
      .all([
        apiReservationService.getReservations({
          hotel: hotel?.id as string,
          limit: 1000,
          date: format(new Date(), 'P'),
        }),
        apiRoomService.getOccupancy({
          hotel: hotel?.id as string,
          date: format(new Date(), 'P'),
        }),
        apiReservationService.getReservationsByDay({
          hotel: hotel?.id as string,
          startDate: format(subDays(new Date(), 90), 'P'),
          endDate: format(new Date(), 'P'),
        }),
        apiReservationService.getCheckingIn({
          hotel: hotel?.id as string,
          date: format(new Date(), 'P'),
        }),
        apiReservationService.getCheckingOut({
          hotel: hotel?.id as string,
          date: format(new Date(), 'P'),
        })
      ])
      .then(
        axios.spread(
          (
            reservationResponse,
            occupancyResponse,
            reservationsByDayResponse,
            checkingInResponse,
            checkingOutResponse,
          ) => {
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

            setDashboardData({
              currentGuests: reservationResponse.data.meta.totalItems,
              occupancy: occupancyResponse.data.occupancy,
              reservationsByDay: reservationsByDayChartData,
              checkingIn: checkingInResponse.data.length,
              checkingOut: checkingOutResponse.data.length
            });
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
        <div className="grid grid-cols-4 gap-3">
          <NumberStatisticsCard
            icon={<LuUser></LuUser>}
            title="Guests"
            value={currentGuests}
          ></NumberStatisticsCard>
          <NumberStatisticsCard
            icon={<LuUsers></LuUsers>}
            title="Occupancy"
            value={occupancy}
            isPercentage
          ></NumberStatisticsCard>
          <NumberStatisticsCard
            title="Checking In"
            icon={<LuArrowLeftToLine></LuArrowLeftToLine>}
            value={checkingIn}
          ></NumberStatisticsCard>
          <NumberStatisticsCard
            icon={<LuArrowRightToLine></LuArrowRightToLine>}
            title="Checking Out"
            value={checkingOut}
          ></NumberStatisticsCard>
          <div className={styles.card}>
            <div className="flex flex-row justify-start gap-3">
              <div className={styles.title}>Reservations in Past 90 Days</div>
            </div>
            <Line
              data={{
                datasets: [
                  {
                    data: reservationsByDay,
                    pointRadius: 0,
                    borderColor: '#2E7D32',
                    borderJoinStyle: 'bevel',
                    pointStyle: 'circle'
                  },
                ],
              }}
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
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
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

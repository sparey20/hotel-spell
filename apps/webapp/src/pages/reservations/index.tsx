import {
  ICreateReservationDTO,
  IHotel,
  IReservation,
} from '@hotel-spell/api-interfaces';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useReducer, useState } from 'react';
import styles from './index.module.scss';
import Table from '../../components/table/table';
import Modal from '../../components/modal/modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../lib/hooks';
import { RESERVATION_COLUMNS } from './constants';
import { ReservationActionsTypes } from './enums';
import {
  ReservationAction,
  ReservationState,
  ReservationTableItem,
} from './types';

/* eslint-disable-next-line */
type DashboardProps = {};

const reservationActionMap = new Map<
  ReservationActionsTypes,
  (state: ReservationState, action: ReservationAction) => ReservationState
>([
  [
    ReservationActionsTypes.ReservationFetchInit,
    (state: ReservationState, action: ReservationAction) => ({
      ...state,
      loading: true,
      error: false,
    }),
  ],
  [
    ReservationActionsTypes.ReservationFetchFailure,
    (state: ReservationState, action: ReservationAction) => ({
      ...state,
      loading: false,
      error: true,
    }),
  ],
  [
    ReservationActionsTypes.ReservationFetchSuccess,
    (state: ReservationState, action: ReservationAction) => action.payload,
  ],
  [
    ReservationActionsTypes.AddReservation,
    (state: ReservationState, action: ReservationAction) =>
      ({
        ...state,
        loading: false,
        data: [...(state.data as ReservationTableItem[]), action.payload.data],
      } as ReservationState),
  ],
  [
    ReservationActionsTypes.ReservationUpdateInit,
    (state: ReservationState, action: ReservationAction) =>
      ({
        ...state,
        loading: true,
      } as ReservationState),
  ],
]);

const reservationsReducer = (
  state: ReservationState,
  action: ReservationAction
): ReservationState => {
  const mappedAction = reservationActionMap.get(action.type);

  return mappedAction ? mappedAction(state, action) : state;
};

export default function Dashboard(props: DashboardProps) {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [reservations, dispatchReservations] = useReducer(reservationsReducer, {
    loading: true,
    error: false,
    data: [],
  });

  const getReservations = () => {
    axios
      .get(`/api/reservations?hotel=${hotel?.id}`)
      .then(({ data }: AxiosResponse<IReservation[]>) => {
        dispatchReservations({
          type: ReservationActionsTypes.ReservationFetchSuccess,
          payload: {
            loading: false,
            error: false,
            data: data.map((reservation) => ({
              id: reservation.id,
              checkInDate: reservation.checkInDate,
              checkOutDate: reservation.checkOutDate,
              guestFirstName: reservation.guest.firstName,
              guestLastName: reservation.guest.lastName,
              roomNumber: reservation.room.number,
            })),
          },
        });
      })
      .catch((error) => {
        dispatchReservations({
          type: ReservationActionsTypes.ReservationFetchFailure,
          payload: reservations,
        });
      });
  };
  const openCreateReservationModal = () => {
    setIsModalVisible(true);
  };

  const closeCreateReservationModal = () => {
    setIsModalVisible(false);
  };

  const { register, handleSubmit, reset } = useForm<ICreateReservationDTO>();

  const createReservation: SubmitHandler<ICreateReservationDTO> = (
    reservation: ICreateReservationDTO
  ) => {
    reset();
    closeCreateReservationModal();

    dispatchReservations({
      type: ReservationActionsTypes.ReservationUpdateInit,
      payload: reservations,
    });

    axios
      .post('/api/reservations', reservation)
      .then(({ data }: AxiosResponse<IReservation>) => {
        const { id, guest, room, checkInDate, checkOutDate } = data;
        dispatchReservations({
          type: ReservationActionsTypes.AddReservation,
          payload: {
            ...reservations,
            data: {
              id,
              guestFirstName: guest.firstName,
              guestLastName: guest.lastName,
              roomNumber: room.number,
              checkInDate,
              checkOutDate,
            },
          },
        });
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getReservations();
  }, []);

  return (
    <section className={styles.reservations}>
      <div className="flex flex-row p-2 justify-end">
        <button className="buttonPrimary" onClick={openCreateReservationModal}>
          Create
        </button>
        {isModalVisible && (
          <Modal
            header="Create Reservation"
            onClose={closeCreateReservationModal}
            onConfirm={handleSubmit(createReservation)}
          >
            <section className="flex flex-col">
              <form className="flex flex-col gap-4">
                <input
                  className="formInput"
                  type="text"
                  placeholder="First Name"
                  {...register('firstName')}
                />
                <input
                  className="formInput"
                  type="text"
                  placeholder="Last Name"
                  {...register('lastName')}
                />
                <input
                  className="formInput"
                  type="text"
                  placeholder="Email"
                  {...register('email')}
                />
                <input
                  className="formInput"
                  type="text"
                  placeholder="Room Number"
                  {...register('roomNumber')}
                />
                <label>Check In Date</label>
                <input
                  className="formInput"
                  type="date"
                  {...register('checkInDate')}
                />
                <label>Check Out Date</label>
                <input
                  className="formInput"
                  type="date"
                  {...register('checkOutDate')}
                />
              </form>
            </section>
          </Modal>
        )}
      </div>

      {reservations.loading ? (
        <div>loading...</div>
      ) : (
        <Table
          items={reservations.data as ReservationTableItem[]}
          idKey="id"
          columns={RESERVATION_COLUMNS}
        ></Table>
      )}
    </section>
  );
}

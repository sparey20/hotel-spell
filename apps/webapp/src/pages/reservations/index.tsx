import {
  ICreateReservationDTO,
  IHotel,
  IReservation,
  IRoom,
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
import { format } from 'date-fns';
import {
  ReservationAction,
  ReservationState,
  ReservationTableItem,
} from './types';
import Search from '../../components/search/search';

/* eslint-disable-next-line */
type ReservationProps = {};

const today = format(new Date(), 'yyyy-MM-dd');
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
        data: {
          ...action.payload.data,
          reservations: [
            ...(state.data.reservations as ReservationTableItem[]),
            action.payload.data.reservations,
          ],
        },
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

export default function Reservations(props: ReservationProps) {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [reservationPage, dispatchReservations] = useReducer(
    reservationsReducer,
    {
      loading: true,
      error: false,
      data: {
        reservations: [],
        rooms: [],
      },
    }
  );

  const getPageData = () => {
    axios
      .all([
        axios.get(`/api/reservations`, {
          params: {
            hotel: hotel?.id,
          },
        }),
        axios.get(`/api/rooms`, {
          params: {
            hotel: hotel?.id,
          },
        }),
      ])
      .then(
        axios.spread((reservationResponse, roomsResponse) => {
          dispatchReservations({
            type: ReservationActionsTypes.ReservationFetchSuccess,
            payload: {
              loading: false,
              error: false,
              data: {
                reservations: reservationResponse.data.map(
                  (reservation: IReservation) => ({
                    id: reservation.id,
                    checkInDate: reservation.checkInDate,
                    checkOutDate: reservation.checkOutDate,
                    guestFirstName: reservation.guest.firstName,
                    guestLastName: reservation.guest.lastName,
                    roomNumber: reservation.room.number,
                  })
                ),
                rooms: roomsResponse.data,
              },
            },
          });
        })
      );
  };

  const openReservationModal = (formData: any = null) => {
    if (formData) {
      reset(formData);
    } else {
      reset();
    }

    setIsModalVisible(true);
  };

  const closeCreateReservationModal = () => {
    setIsModalVisible(false);
  };

  const { register, handleSubmit, reset, getValues, trigger, formState } =
    useForm<ICreateReservationDTO>({
      mode: 'onBlur',
    });

  const reservationTableActions = [
    {
      label: 'Edit',
      action: (item: any) => {
        openReservationModal({
          firstName: item.guestFirstName,
          lastName: item.guestLastName,
          email: '',
          roomNumber: item.roomNumber,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
        });
      },
    },
  ];

  const searchHandler = (search: string) => {
    axios
      .get(`/api/reservations`, {
        params: {
          hotel: hotel?.id,
          search,
        },
      })
      .then((reservationResponse) => {
        dispatchReservations({
          type: ReservationActionsTypes.ReservationFetchSuccess,
          payload: {
            loading: false,
            error: false,
            data: {
              ...reservationPage.data,
              reservations: reservationResponse.data.map(
                (reservation: IReservation) => ({
                  id: reservation.id,
                  checkInDate: reservation.checkInDate,
                  checkOutDate: reservation.checkOutDate,
                  guestFirstName: reservation.guest.firstName,
                  guestLastName: reservation.guest.lastName,
                  roomNumber: reservation.room.number,
                })
              ),
            },
          },
        });
      });
  };

  const createReservation: SubmitHandler<ICreateReservationDTO> = (
    reservation: ICreateReservationDTO
  ) => {
    closeCreateReservationModal();

    // dispatchReservations({
    //   type: ReservationActionsTypes.ReservationUpdateInit,
    //   payload: reservationPage,
    // });

    console.log('here', reservation);

    axios
      .post('/api/reservations', reservation)
      .then(({ data }: AxiosResponse<IReservation>) => {
        const { id, guest, room, checkInDate, checkOutDate } = data;
        dispatchReservations({
          type: ReservationActionsTypes.AddReservation,
          payload: {
            ...reservationPage,
            data: {
              ...reservationPage.data,
              reservations: {
                id,
                guestFirstName: guest.firstName,
                guestLastName: guest.lastName,
                roomNumber: room.number,
                checkInDate,
                checkOutDate,
              },
            },
          },
        });
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState]);

  useEffect(() => {
    getPageData();
  }, []);

  return (
    <section className={styles.reservations}>
      <section className={styles.header}>
        <h1 className={styles.title}>Reservations</h1>
        <div className="flex flex-row p-2 gap-3 justify-end items-center">
          <div className="flex-1 h-full">
            <Search onSearch={searchHandler}></Search>
          </div>
          <button className="buttonPrimary" onClick={openReservationModal}>
            Create Reservation
          </button>
          {isModalVisible && (
            <Modal
              header="Create or Edit a Reservation"
              onClose={closeCreateReservationModal}
              onConfirm={handleSubmit(createReservation)}
            >
              <section className="flex flex-col">
                <form className="flex flex-col gap-4">
                  <input
                    className={`formInput ${
                      formState.errors.firstName ? 'error' : ''
                    }`}
                    type="text"
                    placeholder="First Name *"
                    {...register('firstName', { required: true })}
                  />
                  <input
                    className={`formInput ${
                      formState.errors.lastName ? 'error' : ''
                    }`}
                    type="text"
                    placeholder="Last Name *"
                    {...register('lastName', { required: true })}
                  />
                  <input
                    className={`formInput ${
                      formState.errors.email ? 'error' : ''
                    }`}
                    type="text"
                    placeholder="Email *"
                    {...register('email', {
                      required: true,
                      pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    })}
                  />
                  <select
                    className={`formInput ${
                      formState.errors.roomNumber ? 'error' : ''
                    }`}
                    {...register('roomNumber', { required: true })}
                  >
                    <option disabled>Room Number *</option>
                    {reservationPage.data.rooms.map((room) => (
                      <option key={room.id} value={room.number}>
                        {room.number}
                      </option>
                    ))}
                  </select>
                  <label>Check In Date</label>
                  <input
                    className={`formInput ${
                      formState.errors.checkInDate ? 'error' : ''
                    }`}
                    type="date"
                    min={today}
                    {...register('checkInDate', { required: true, min: today })}
                    aria-invalid={
                      formState.errors.checkInDate ? 'true' : 'false'
                    }
                    onInput={() => {
                      trigger('checkOutDate');
                    }}
                  />
                  <label>Check Out Date</label>
                  <input
                    className={`formInput ${
                      formState.errors.checkOutDate ? 'error' : ''
                    }`}
                    type="date"
                    min={getValues('checkInDate')}
                    {...register('checkOutDate', {
                      required: true,
                      min: getValues('checkInDate'),
                    })}
                  />
                </form>
              </section>
            </Modal>
          )}
        </div>
      </section>

      {reservationPage.loading ? (
        <div>loading...</div>
      ) : (
        <Table
          items={reservationPage.data.reservations as ReservationTableItem[]}
          idKey="id"
          columns={RESERVATION_COLUMNS}
          itemActions={reservationTableActions}
        ></Table>
      )}
    </section>
  );
}

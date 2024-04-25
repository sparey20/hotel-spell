import {
  ICreateReservationDTO,
  IReservation,
} from '@hotel-spell/api-interfaces';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useReducer, useState } from 'react';
import styles from './index.module.scss';
import Table from '../../components/table/table';
import { ITableColumn } from '../../components/table/interfaces';
import Modal from '../../components/modal/modal';
import { SubmitHandler, useForm } from 'react-hook-form';

/* eslint-disable-next-line */
type DashboardProps = {};

type ReservationTableItem = {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  roomNumber: number;
  checkInDate: string;
  checkOutDate: string;
};

const reservationsReducer = (
  state: ReservationTableItem[],
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case 'SET_RESERVATIONS':
      return action.payload;
    case 'ADD_RESERVATION':
      return [...state, action.payload as ReservationTableItem];
    default:
      throw new Error();
  }
};

const columns: ITableColumn[] = [
  {
    sortable: false,
    label: 'First Name',
    key: 'guestFirstName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Last Name',
    key: 'guestLastName',
    size: 2,
  },
  {
    sortable: false,
    label: 'Check In',
    key: 'checkInDate',
    size: 2,
  },
  {
    sortable: false,
    label: 'Check Out',
    key: 'checkOutDate',
    size: 2,
  },
  {
    sortable: false,
    label: 'Room',
    key: 'roomNumber',
    size: 2,
  },
];

export default function Dashboard(props: DashboardProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const getReservations = () => {
    axios
      .get('/api/reservations')
      .then(({ data }: AxiosResponse<IReservation[]>) => {
        dispatchReservations({
          type: 'SET_RESERVATIONS',
          payload: data.map((reservation) => ({
            id: reservation.id,
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            guestFirstName: reservation.guest.firstName,
            guestLastName: reservation.guest.lastName,
            roomNumber: reservation.room.number,
          })),
        });
      })
      .catch((error) => console.log('error', error));
  };

  const [reservations, dispatchReservations] = useReducer(
    reservationsReducer,
    []
  );

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
    axios
      .post('/api/reservations', reservation)
      .then(({ data }: AxiosResponse<IReservation>) => {
        const { id, guest, room, checkInDate, checkOutDate } = data;
        dispatchReservations({
          type: 'ADD_RESERVATION',
          payload: {
            id,
            guestFirstName: guest.firstName,
            guestLastName: guest.lastName,
            roomNumber: room.number,
            checkInDate,
            checkOutDate,
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
      <Table items={reservations} idKey="id" columns={columns}></Table>
    </section>
  );
}

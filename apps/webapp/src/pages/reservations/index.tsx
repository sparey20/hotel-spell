import {
  ICreateReservationDTO,
  IHotel,
  IReservation,
  IRoom,
} from '@hotel-spell/api-interfaces';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useReducer, useState } from 'react';
import styles from './index.module.scss';
import Table, { TableColumn } from '../../components/table/table';
import Modal from '../../components/modal/modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../lib/hooks';
import { RESERVATION_COLUMNS } from './constants';
import { ReservationActionsTypes } from './enums';
import { format } from 'date-fns';
import {
  ReservationAction,
  ReservationModalFormInputs,
  ReservationState,
  ReservationTableItem,
} from './types';
import Search from '../../components/search/search';

/* eslint-disable-next-line */
type ReservationProps = {};

const today = format(new Date(), 'yyyy-MM-dd');
const itemsPerPage = 30;
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
    ReservationActionsTypes.UpdateReservation,
    (state: ReservationState, action: ReservationAction) => {
      const reservationIndex = (
        state.data.reservations as ReservationTableItem[]
      ).findIndex(
        (reservation: ReservationTableItem) =>
          reservation.id ===
          (action.payload.data.reservations as ReservationTableItem).id
      );
      return {
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          reservations: [
            ...(state.data.reservations as ReservationTableItem[]).slice(
              0,
              reservationIndex
            ),
            action.payload.data.reservations,
            ...(state.data.reservations as ReservationTableItem[]).slice(
              reservationIndex + 1
            ),
          ],
        },
      } as ReservationState;
    },
  ],
  [
    ReservationActionsTypes.RemoveReservation,
    (state: ReservationState, action: ReservationAction) => {
      return {
        ...state,
        loading: false,
        data: {
          ...action.payload.data,
          reservations: (
            state.data.reservations as ReservationTableItem[]
          ).filter(
            (reservation) =>
              reservation.id !==
              (action.payload.data.reservations as ReservationTableItem).id
          ),
        },
      } as ReservationState;
    },
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

const mapReservationsDataToTableItems = (
  reservations: IReservation[]
): ReservationTableItem[] => {
  return reservations.map((reservation) => ({
    id: reservation.id,
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
    guestFirstName: reservation.guest.firstName,
    guestLastName: reservation.guest.lastName,
    guestEmail: reservation.guest.email,
    roomNumber: reservation.room.number,
  }));
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
      search: '',
      sorting: {
        column: 'checkOutDate',
        direction: 'desc',
      },
      data: {
        reservations: [],
        rooms: [],
        pagination: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage,
          totalPages: 0,
          currentPage: 1,
        },
      },
    }
  );

  const getPageData = () => {
    dispatchReservations({
      type: ReservationActionsTypes.ReservationFetchInit,
      payload: reservationPage,
    });

    axios
      .all([
        axios.get(`/api/reservations`, {
          params: {
            hotel: hotel?.id,
            limit: itemsPerPage,
            sortColumn: reservationPage.sorting.column,
            sortDirection: reservationPage.sorting.direction,
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
              ...reservationPage,
              loading: false,
              error: false,
              data: {
                reservations: mapReservationsDataToTableItems(
                  reservationResponse.data.items
                ),
                rooms: roomsResponse.data,
                pagination: reservationResponse.data.meta,
              },
            },
          });
        })
      );
  };

  const getReservations = ({
    page = reservationPage.data.pagination.currentPage,
    search = reservationPage.search,
    sortColumn = reservationPage.sorting.column,
    sortDirection = reservationPage.sorting.direction,
  }) => {
    axios
      .get(`/api/reservations`, {
        params: {
          hotel: hotel?.id,
          limit: itemsPerPage,
          search,
          page,
          sortColumn,
          sortDirection,
        },
      })
      .then((reservationResponse) => {
        dispatchReservations({
          type: ReservationActionsTypes.ReservationFetchSuccess,
          payload: {
            ...reservationPage,
            loading: false,
            error: false,
            sorting: {
              column: sortColumn,
              direction: sortDirection,
            },
            data: {
              ...reservationPage.data,
              reservations: mapReservationsDataToTableItems(
                reservationResponse.data.items
              ),
              pagination: reservationResponse.data.meta,
            },
          },
        });
      });
  };

  const openReservationModal = (formData: any = null) => {
    if (formData) {
      reset(formData);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        roomNumber: 0,
        checkInDate: '',
        checkOutDate: '',
        id: '',
      });
    }

    setIsModalVisible(true);
  };

  const closeCreateReservationModal = () => {
    setIsModalVisible(false);
  };

  const { register, handleSubmit, reset, getValues, trigger, formState } =
    useForm<ReservationModalFormInputs>({
      mode: 'onBlur',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        roomNumber: 0,
        checkInDate: '',
        checkOutDate: '',
        id: '',
      },
    });

  const reservationTableActions = [
    {
      label: 'Edit',
      action: (item: any) => {
        openReservationModal({
          id: item.id,
          firstName: item.guestFirstName,
          lastName: item.guestLastName,
          email: item.guestEmail,
          roomNumber: item.roomNumber,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
        });
      },
    },
    {
      label: 'Delete',
      action: (item: any) => {
        deleteReservation(item);
      },
    },
  ];

  const deleteReservation = (reservation: ReservationTableItem) => {
    axios
      .delete(`/api/reservations/${reservation.id}`)
      .then(() => {
        dispatchReservations({
          type: ReservationActionsTypes.RemoveReservation,
          payload: {
            ...reservationPage,
            loading: false,
            error: false,
            data: {
              ...reservationPage.data,
              reservations: reservation,
            },
          },
        });
      })
      .catch((error) => console.log('error', error));
  };

  const searchHandler = (search: string) => {
    dispatchReservations({
      type: ReservationActionsTypes.ReservationFetchInit,
      payload: reservationPage,
    });

    axios
      .get(`/api/reservations`, {
        params: {
          hotel: hotel?.id,
          search,
          limit: itemsPerPage,
          sortColumn: reservationPage.sorting.column,
          sortDirection: reservationPage.sorting.direction,
        },
      })
      .then((reservationResponse) => {
        dispatchReservations({
          type: ReservationActionsTypes.ReservationFetchSuccess,
          payload: {
            ...reservationPage,
            loading: false,
            error: false,
            search,
            data: {
              ...reservationPage.data,
              reservations: mapReservationsDataToTableItems(
                reservationResponse.data.items
              ),
              pagination: reservationResponse.data.meta,
            },
          },
        });
      })
      .catch((error) => console.log('error', error));
  };

  const createReservation = (
    reservationForm: ReservationModalFormInputs
  ): void => {
    axios
      .post('/api/reservations', reservationForm)
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
                guestEmail: guest.email,
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

  const editReservation = (
    reservationForm: ReservationModalFormInputs
  ): void => {
    axios
      .patch(`/api/reservations/${reservationForm.id}`, reservationForm)
      .then(({ data }: AxiosResponse<IReservation>) => {
        const { id, guest, room, checkInDate, checkOutDate } = data;
        dispatchReservations({
          type: ReservationActionsTypes.UpdateReservation,
          payload: {
            ...reservationPage,
            data: {
              ...reservationPage.data,
              reservations: {
                id,
                guestFirstName: guest.firstName,
                guestLastName: guest.lastName,
                guestEmail: guest.email,
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

  const handleReservationSubmit: SubmitHandler<ReservationModalFormInputs> = (
    reservationForm: ReservationModalFormInputs
  ) => {
    closeCreateReservationModal();

    dispatchReservations({
      type: ReservationActionsTypes.ReservationUpdateInit,
      payload: reservationPage,
    });

    if (reservationForm.id) {
      editReservation(reservationForm);
      return;
    }

    createReservation(reservationForm);
  };

  const handleGoToNextPage = () => {
    dispatchReservations({
      type: ReservationActionsTypes.ReservationFetchInit,
      payload: reservationPage,
    });

    getReservations({ page: reservationPage.data.pagination.currentPage + 1 });
  };

  const handleGoToPreviosPage = () => {
    dispatchReservations({
      type: ReservationActionsTypes.ReservationFetchInit,
      payload: reservationPage,
    });

    getReservations({ page: reservationPage.data.pagination.currentPage - 1 });
  };

  const handleSortColumn = (column: string, direction: 'asc' | 'desc') => {
    getReservations({ sortColumn: column, sortDirection: direction });
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
          <button
            className="buttonPrimary"
            onClick={() => openReservationModal()}
          >
            Create Reservation
          </button>
          {isModalVisible && (
            <Modal
              header="Create or Edit a Reservation"
              onClose={closeCreateReservationModal}
              onConfirm={handleSubmit(handleReservationSubmit)}
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
                    {...register('checkInDate', {
                      required: true,
                      min: today,
                      disabled: getValues('id') ? true : false,
                    })}
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
                  <input type="hidden" {...register('id')} />
                </form>
              </section>
            </Modal>
          )}
        </div>
      </section>
      <section className={styles.tableContainer}>
        <Table
          items={reservationPage.data.reservations as ReservationTableItem[]}
          idKey="id"
          columns={RESERVATION_COLUMNS}
          itemActions={reservationTableActions}
          isLoading={reservationPage.loading}
          pagination={{
            totalItems: reservationPage.data.pagination.totalItems,
            itemsPerPage: reservationPage.data.pagination.itemsPerPage,
            totalPages: reservationPage.data.pagination.totalPages,
            itemCount: reservationPage.data.pagination.itemCount,
            currentPage: reservationPage.data.pagination.currentPage,
            goToNextPage: handleGoToNextPage,
            goToPreviousPage: handleGoToPreviosPage,
          }}
          sorting={{
            column: reservationPage.sorting.column,
            direction: reservationPage.sorting.direction,
            sortColumn: (column, direction) =>
              handleSortColumn(column, direction),
          }}
        ></Table>
      </section>
    </section>
  );
}

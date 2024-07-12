import { IHotel, IReservation } from '@hotel-spell/api-interfaces';
import axios, { AxiosResponse } from 'axios';
import { Fragment, useEffect, useMemo, useReducer, useRef } from 'react';
import styles from './index.module.scss';
import Table from '../../components/table/table';
import { SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  RESERVATION_COLUMNS,
  RESERVATION_ITEMS_PER_PAGE,
  RESERVATION_REDUCER,
} from '../../lib/features/reservation/constants';
import { ReservationActionsTypes } from '../../lib/features/reservation/enums';
import { ReservationTableItem } from '../../lib/features/reservation/types';
import Search from '../../components/search/search';
import ReservationFormModal from './components/reservationFormModal/reservationFormModal';
import * as apiReservationService from '../../lib/features/reservation/apiReservationService';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import { showToastWithTimeout } from '../../lib/features/toast/toastSlice';

/* eslint-disable-next-line */
type ReservationProps = {};

export default function Reservations(props: ReservationProps) {
  const reservationFormModalRef = useRef();
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const dispatch = useAppDispatch();
  const [reservationPage, dispatchReservations] = useReducer(
    RESERVATION_REDUCER,
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
          itemsPerPage: RESERVATION_ITEMS_PER_PAGE,
          totalPages: 0,
          currentPage: 1,
        },
      },
    }
  );
  const { pagination, reservations, rooms } = reservationPage.data;
  const { loading, sorting } = reservationPage;
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

  const getInitialReservationLoadData = () => {
    dispatchReservations({
      type: ReservationActionsTypes.ReservationFetchInit,
      payload: reservationPage,
    });

    axios
      .all([
        apiReservationService.getReservations({
          hotel: hotel?.id as string,
          limit: RESERVATION_ITEMS_PER_PAGE,
          sortColumn: sorting.column,
          sortDirection: sorting.direction,
        }),
        apiRoomService.getRooms({ hotel: hotel?.id as string }),
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
                reservations: mapReservationsToTableViewItems(
                  reservationResponse.data.items
                ),
                rooms: roomsResponse.data,
                pagination: reservationResponse.data.meta,
              },
            },
          });
        }),
        (error) => {
          dispatchReservations({
            type: ReservationActionsTypes.ReservationFetchFailure,
            payload: reservationPage,
          });
          dispatch(
            showToastWithTimeout({
              message: 'Failed requesting reservations.',
              type: 'error',
            }) as any
          );
        }
      );
  };

  const getReservations = ({
    page = pagination.currentPage,
    search = reservationPage.search,
    sortColumn = sorting.column,
    sortDirection = sorting.direction,
  }) => {
    apiReservationService
      .getReservations({
        hotel: hotel?.id as string,
        limit: RESERVATION_ITEMS_PER_PAGE,
        search,
        page,
        sortColumn,
        sortDirection,
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
              reservations: mapReservationsToTableViewItems(
                reservationResponse.data.items
              ),
              pagination: reservationResponse.data.meta,
            },
          },
        });
      });
  };

  const openReservationModal = (formData: any = null) => {
    (reservationFormModalRef as any)?.current?.openReservationModal(formData);
  };

  const searchReservations = (search: string) => {
    apiReservationService
      .getReservations({
        hotel: hotel?.id as string,
        search,
        limit: RESERVATION_ITEMS_PER_PAGE,
        sortColumn: sorting.column,
        sortDirection: sorting.direction,
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
              reservations: mapReservationsToTableViewItems(
                reservationResponse.data.items
              ),
              pagination: reservationResponse.data.meta,
            },
          },
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting reservations.',
            type: 'error',
          }) as any
        );
      });
  };

  const createReservation = (
    reservationForm: apiReservationService.ReservationDTO
  ): void => {
    apiReservationService
      .createReservation(reservationForm)
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
        dispatch(
          showToastWithTimeout({
            message: `Created reservation for ${guest.firstName} ${guest.lastName}.`,
            type: 'success',
          }) as any
        );
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed creating reservation.',
            type: 'error',
          }) as any
        );
      });
  };

  const editReservation = (
    reservationForm: apiReservationService.ReservationDTO
  ): void => {
    apiReservationService
      .updateReservation(reservationForm.id, reservationForm)
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
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed editing reservation.',
            type: 'error',
          }) as any
        );
      });
  };

  const deleteReservation = (reservation: ReservationTableItem) => {
    apiReservationService
      .deleteReservation(reservation.id)
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
        dispatch(
          showToastWithTimeout({
            message: `Deleted reservation.`,
            type: 'success',
          }) as any
        );
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed deleting reservation.',
            type: 'error',
          }) as any
        );
      });
  };

  const reservationSubmit: SubmitHandler<
    apiReservationService.ReservationDTO
  > = (reservationForm: apiReservationService.ReservationDTO) => {
    (reservationFormModalRef as any)?.current?.closeReservationModal();

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

  const goToNextPage = () => {
    getReservations({ page: reservationPage.data.pagination.currentPage + 1 });
  };

  const goToPreviousPage = () => {
    getReservations({ page: reservationPage.data.pagination.currentPage - 1 });
  };

  const sortColumn = (column: string, direction: 'asc' | 'desc') => {
    getReservations({ sortColumn: column, sortDirection: direction });
  };

  const mapReservationsToTableViewItems = useMemo(() => {
    return (reservations: IReservation[]): ReservationTableItem[] => {
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
  }, []);

  useEffect(() => {
    getInitialReservationLoadData();
  }, []);

  return (
    <Fragment>
      <section className={styles.reservations}>
        <section className={styles.header}>
          <h1 className={styles.title}>Reservations</h1>
          <div className="flex flex-row pt-2 gap-3 justify-end items-center">
            <div className="flex-1 h-full">
              <Search onSearch={searchReservations}></Search>
            </div>
            <button
              className="buttonPrimary"
              onClick={() => openReservationModal()}
            >
              Create Reservation
            </button>
          </div>
        </section>
        <section className={styles.tableContainer}>
          <Table
            items={reservations as ReservationTableItem[]}
            idKey="id"
            columns={RESERVATION_COLUMNS}
            itemActions={reservationTableActions}
            isLoading={loading}
            pagination={{
              ...pagination,
              goToNextPage,
              goToPreviousPage,
            }}
            sorting={{
              ...sorting,
              sortColumn,
            }}
          ></Table>
        </section>
      </section>
      <ReservationFormModal
        ref={reservationFormModalRef}
        rooms={rooms}
        reservationSubmit={reservationSubmit}
      ></ReservationFormModal>
    </Fragment>
  );
}

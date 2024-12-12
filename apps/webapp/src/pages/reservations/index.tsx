import styles from './index.module.scss';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import { useEffect, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  IAPIListView,
  IHotel,
  IReservation,
  IRoom,
} from '@hotel-spell/api-interfaces';
import {
  ItemAction,
  ListViewTableColumn,
} from '../../components/list-view/types';
import ListView from '../../components/list-view/ListView';
import SidePanel from '../../components/list-view/SidePanel';
import { useForm } from 'react-hook-form';
import { showToastWithTimeout } from '../../lib/features/toast/toastSlice';
import * as apiReservationService from '../../lib/features/reservation/apiReservationService';
import { format } from 'date-fns';

interface ReservationsPageState {
  reservations: IAPIListView<IReservation>;
  isLoading: boolean;
  rooms: IRoom[];
}

enum ReservationsPageActionTypes {
  pageLoad = 'PAGE_LOAD',
  updateReservationsListView = 'UPDATE_RESERVATIONS_LIST_VIEW',
}

interface ReservationFormData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  roomNumber: number | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  id?: string;
}

type ReservationsPageAction =
  | {
      type: ReservationsPageActionTypes.pageLoad;
      payload: { reservations: IAPIListView<IReservation>; rooms: IRoom[] };
    }
  | {
      type: ReservationsPageActionTypes.updateReservationsListView;
      payload: { reservations: IAPIListView<IReservation> };
    };

const roomsPageReducerMap = new Map<
  ReservationsPageActionTypes,
  (
    state: ReservationsPageState,
    action: ReservationsPageAction
  ) => ReservationsPageState
>([
  [
    ReservationsPageActionTypes.pageLoad,
    (
      state: ReservationsPageState,
      action: ReservationsPageAction
    ): ReservationsPageState =>
      action.type === ReservationsPageActionTypes.pageLoad
        ? {
            reservations: action.payload.reservations,
            rooms: action.payload.rooms,
            isLoading: false,
          }
        : state,
  ],
  [
    ReservationsPageActionTypes.updateReservationsListView,
    (state: ReservationsPageState, action: ReservationsPageAction) =>
      action.type === ReservationsPageActionTypes.updateReservationsListView
        ? {
            ...state,
            reservations: action.payload.reservations,
            isLoading: false,
          }
        : state,
  ],
]);

const reservationsPageReducer = (
  state: ReservationsPageState,
  action: ReservationsPageAction
): ReservationsPageState => {
  const mappedAction = roomsPageReducerMap.get(action.type);

  if (!mappedAction) {
    return state;
  }

  return mappedAction(state, action);
};

const listViewItemPerPage = 20;

const initialPageState: ReservationsPageState = {
  reservations: {
    items: [],
    meta: {
      totalItems: 0,
      itemCount: listViewItemPerPage,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 1,
    },
  },
  isLoading: true,
  rooms: [],
};

export default function ReservationsComponent() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };

  let reservationDataQueryParams: apiReservationService.GetReservationParams = {
    hotel: hotel?.id as string,
    page: 1,
    sortColumn: 'checkInDate',
    sortDirection: 'desc',
    limit: listViewItemPerPage,
    search: '',
  };

  const dispatch = useAppDispatch();

  const [reservationsPageState, reservationsPageDispatch] = useReducer(
    reservationsPageReducer,
    initialPageState
  );

  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const { register, handleSubmit, reset, getValues, trigger, formState } =
    useForm<ReservationFormData>({
      mode: 'onBlur',
      defaultValues: {
        firstName: null,
        lastName: null,
        email: null,
        roomNumber: null,
        checkInDate: null,
        checkOutDate: null,
      },
    });

  const tableConfig = {
    columns: [
      {
        sortable: false,
        label: 'First Name',
        key: 'guestFirstName',
        size: 2,
        transform: (reservation: IReservation) => reservation.guest.firstName
      },
      {
        sortable: false,
        label: 'Last Name',
        key: 'guestLastName',
        size: 2,
        transform: (reservation: IReservation) => reservation.guest.lastName
      },
      {
        sortable: true,
        label: 'Check In',
        key: 'checkInDate',
        size: 2,
      },
      {
        sortable: true,
        label: 'Check Out',
        key: 'checkOutDate',
        size: 2,
      },
      {
        sortable: false,
        label: 'Room',
        key: 'roomNumber',
        size: 2,
        transform: (reservation: IReservation) => reservation.room.number
      },
    ] as ListViewTableColumn[],
    itemActions: [
      {
        label: 'Edit',
        action: (reservation: IReservation) => editReservation(reservation),
      },
      {
        label: 'Cancel',
        action: (reservation: IReservation) => cancelReservation(reservation),
      },
    ] as ItemAction[],
  };

  const createReservation = () => {
    setIsSidePanelVisible(true);
    reset({
      firstName: null,
      lastName: null,
      email: null,
      roomNumber: null,
      checkInDate: null,
      checkOutDate: null,
    });
  };

  const editReservation = (reservation: IReservation) => {
    setIsSidePanelVisible(true);

    reset({
      firstName: reservation.guest.firstName,
      lastName: reservation.guest.lastName,
      email: reservation.guest.email,
      roomNumber: reservation.room.number,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      id: reservation.id,
    });
  };

  const onCloseSidePanel = () => setIsSidePanelVisible(false);

  const onConfirmSidePanel = (reservationFormData: ReservationFormData) => {
    if (!reservationFormData) {
      return;
    }

    if (reservationFormData.id) {
      apiReservationService
        .updateReservation(reservationFormData.id, reservationFormData)
        .then(({ data }) => {
          reservationsPageDispatch({
            type: ReservationsPageActionTypes.updateReservationsListView,
            payload: {
              reservations: {
                ...reservationsPageState.reservations,
                items: reservationsPageState.reservations.items.map((reservation: IReservation) => {
                  if (reservation.id === reservationFormData.id) {
                    return {
                      ...reservation,
                      guest: {
                        ...reservation.guest,
                        firstName: reservationFormData.firstName,
                        lastName: reservationFormData.lastName,
                        email: reservationFormData.email,
                      },
                      room: {
                        ...reservation.room,
                        number: reservationFormData.roomNumber
                      }
                    } as IReservation;
                  }

                  return reservation;
                }),
              },
            },
          });
        })
        .catch((error) => {
          dispatch(
            showToastWithTimeout({
              message: 'Failed editing room.',
              type: 'error',
            }) as any
          );
        });
    } else {
      apiReservationService
        .createReservation(reservationFormData)
        .then(({ data }) => {
          dispatch(
            showToastWithTimeout({
              message: `Created reservation.`,
              type: 'success',
            }) as any
          );
        })
        .catch((error) => {
          dispatch(
            showToastWithTimeout({
              message: 'Failed creating a room.',
              type: 'error',
            }) as any
          );
        });
    }

    setIsSidePanelVisible(false);
  };

  const cancelReservation = (reservation: IReservation) => {
    apiReservationService
      .deleteReservation(reservation.id as string)
      .then(() => {
        reservationsPageDispatch({
          type: ReservationsPageActionTypes.updateReservationsListView,
          payload: {
            reservations: {
              ...reservationsPageState.reservations,
              items: reservationsPageState.reservations.items.filter(
                (reservationItem) => reservationItem.id !== reservation.id
              ),
            },
          },
        });

        dispatch(
          showToastWithTimeout({
            message: `Canceled reservation`,
            type: 'success',
          }) as any
        );
      })
      .catch(() => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed deleting room.',
            type: 'error',
          }) as any
        );
      });
  };

  const fetchReservationData = () => {
    apiReservationService
      .getReservations(reservationDataQueryParams)
      .then(({ data }) => {
        reservationsPageDispatch({
          type: ReservationsPageActionTypes.updateReservationsListView,
          payload: {
            reservations: {
              ...reservationsPageState.reservations,
              items: data.items,
              meta: data.meta,
            },
          },
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting reservation data.',
            type: 'error',
          }) as any
        );
      });
  };

  const goToPageHandler = (currentPage: number) => {
    reservationDataQueryParams = {
      ...reservationDataQueryParams,
      page: currentPage,
    };

    fetchReservationData();
  };

  const sortColumnHandler = (column: string, direction: 'asc' | 'desc') => {
    reservationDataQueryParams = {
      ...reservationDataQueryParams,
      sortColumn: column,
      sortDirection: direction,
    };

    fetchReservationData();
  };

  const searchItemsHandler = (search: string) => {
    reservationDataQueryParams = {
      ...reservationDataQueryParams,
      search,
    };

    fetchReservationData();
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState]);

  useEffect(() => {
    if (!hotel) {
      return;
    }

    Promise.all([
      apiReservationService.getReservations(reservationDataQueryParams),
      apiRoomService.getRooms({hotel: hotel?.id ?? '', limit: 1000}),
    ])
      .then(([reservationsDataResponse, roomsDataResponse]) => {
        reservationsPageDispatch({
          type: ReservationsPageActionTypes.pageLoad,
          payload: {
            rooms: roomsDataResponse.data.items,
            reservations: reservationsDataResponse.data,
          } as ReservationsPageState,
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting page data.',
            type: 'error',
          }) as any
        );
      });
  }, []);

  return (
    <>
      <ListView
        entityName="Reservations"
        config={tableConfig}
        isLoading={reservationsPageState.isLoading}
        data={reservationsPageState.reservations}
        goToPageHandler={goToPageHandler}
        sortColumnHandler={sortColumnHandler}
        searchItemsHandler={searchItemsHandler}
        createItemHandler={createReservation}
      ></ListView>
      <SidePanel
        isVisible={isSidePanelVisible}
        header="Create Reservation"
        onClose={onCloseSidePanel}
        onConfirm={handleSubmit(onConfirmSidePanel)}
      >
        <form className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 w-full">
            <input
              className={`formInput w-full ${
                formState.errors.firstName ? 'error' : ''
              }`}
              type="text"
              placeholder="First Name *"
              {...register('firstName', { required: true })}
            />
            <input
              className={`formInput w-full ${
                formState.errors.lastName ? 'error' : ''
              }`}
              type="text"
              placeholder="Last Name *"
              {...register('lastName', { required: true })}
            />
          </div>
          <input
            className={`formInput ${formState.errors.email ? 'error' : ''}`}
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
            {reservationsPageState.rooms.map((room) => (
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
            aria-invalid={formState.errors.checkInDate ? 'true' : 'false'}
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
            min={getValues('checkInDate') ?? today}
            {...register('checkOutDate', {
              required: true,
              min: getValues('checkInDate') ?? today,
            })}
          />
          <input type="hidden" {...register('id')} />
        </form>
      </SidePanel>
    </>
  );
}

import { TableColumn } from '../../components/table/table';
import { ReservationActionsTypes } from './enums';
import {
  ReservationAction,
  ReservationState,
  ReservationTableItem,
} from './types';

export const RESERVATION_COLUMNS: TableColumn[] = [
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
  },
];

export const RESERVATION_ITEMS_PER_PAGE = 30;

export const RESERVATION_REDUCER_ACTION_MAP = new Map<
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
      data: {
        ...state.data,
        reservations: [],
      },
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

export const RESERVATION_REDUCER = (
  state: ReservationState,
  action: ReservationAction
): ReservationState => {
  const mappedAction = RESERVATION_REDUCER_ACTION_MAP.get(action.type);

  return mappedAction ? mappedAction(state, action) : state;
};

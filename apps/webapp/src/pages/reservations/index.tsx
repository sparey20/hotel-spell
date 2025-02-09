import styles from './index.module.scss';
import * as apiRoomTypeService from '../../lib/features/roomType/apiRoomTypeService';
import { useEffect, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  IAPIListView,
  IHotel,
  IReservation,
  IRoom,
  IRoomType,
} from '@hotel-spell/api-interfaces';
import {
  ItemAction,
} from '../../components/list-view/types';
import SidePanel from '../../components/side-panel/SidePanel';
import { useForm } from 'react-hook-form';
import { showToastWithTimeout } from '../../lib/features/toast/toastSlice';
import * as apiReservationService from '../../lib/features/reservation/apiReservationService';
import { addDays, differenceInDays, format, isWithinInterval } from 'date-fns';
import Table, { TableColumn } from '../../components/table/Table';
import { LuBookPlus } from 'react-icons/lu';
import DaySelectionFrame from '../../components/day-selection-frame/DaySelectionFrame';
import ReservationForm from './ReservationForm';
import SidePanelHeader from '../../components/side-panel/SidePanelHeader';
import SidePanelBody from '../../components/side-panel/SidePanelBody';
import { IoChevronDown } from 'react-icons/io5';
import { Datepicker, Popover } from 'flowbite-react';

interface ReservationsPageState {
  reservations: IAPIListView<IReservation>;
  isLoading: boolean;
  roomTypes: IRoomType[];
  selectedDay: Date;
}

enum ReservationsPageActionTypes {
  pageLoad = 'PAGE_LOAD',
  updateReservationsListView = 'UPDATE_RESERVATIONS_LIST_VIEW',
  updateDaySelection = 'UPDATE_DAY_SELECTION',
}

export interface ReservationFormData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  room: IRoom | null;
  checkInDate: string | null;
  duration: number | null;
  roomTypeId: string | null;
  phone: string | null;
  id?: string;
}

type ReservationsPageAction =
  | {
      type: ReservationsPageActionTypes.pageLoad;
      payload: {
        reservations: IAPIListView<IReservation>;
        roomTypes: IRoomType[];
      };
    }
  | {
      type: ReservationsPageActionTypes.updateReservationsListView;
      payload: { reservations: IAPIListView<IReservation> };
    }
  | {
      type: ReservationsPageActionTypes.updateDaySelection;
      payload: { selectedDay: Date };
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
            ...state,
            reservations: action.payload.reservations,
            roomTypes: action.payload.roomTypes,
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
  [
    ReservationsPageActionTypes.updateDaySelection,
    (state: ReservationsPageState, action: ReservationsPageAction) =>
      action.type === ReservationsPageActionTypes.updateDaySelection
        ? {
            ...state,
            selectedDay: action.payload.selectedDay,
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
  roomTypes: [],
  selectedDay: new Date(),
};

export default function ReservationsComponent() {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };

  const [isDateSelectionVisible, setIsDateSelectionVisible] =
    useState<boolean>(false);

  let reservationDataQueryParams: apiReservationService.GetReservationParams = {
    hotel: hotel?.id as string,
    page: 1,
    sortColumn: 'checkInDate',
    sortDirection: 'desc',
    limit: listViewItemPerPage,
    search: '',
    date: format(initialPageState.selectedDay, 'P'),
  };

  const dispatch = useAppDispatch();
  const [reservationsPageState, reservationsPageDispatch] = useReducer(
    reservationsPageReducer,
    initialPageState
  );
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    watch,
    formState,
    setValue,
  } = useForm<ReservationFormData>({
    mode: 'onBlur',
    defaultValues: {
      firstName: null,
      lastName: null,
      email: null,
      room: null,
      checkInDate: format(initialPageState.selectedDay, 'P'),
      roomTypeId: null,
      phone: null,
      duration: 1,
    },
  });

  const tableConfig = {
    columns: [
      {
        sortable: false,
        label: 'First Name',
        key: 'guestFirstName',
        size: 2,
        transform: (reservation: IReservation) => reservation.guest.firstName,
      },
      {
        sortable: false,
        label: 'Last Name',
        key: 'guestLastName',
        size: 2,
        transform: (reservation: IReservation) => reservation.guest.lastName,
      },
      {
        sortable: true,
        label: 'Check In',
        key: 'checkInDate',
        transform: (reservation: IReservation) =>
          format(reservation.checkInDate, 'PP'),
        size: 2,
      },
      {
        sortable: true,
        label: 'Check Out',
        key: 'checkOutDate',
        transform: (reservation: IReservation) =>
          format(reservation.checkOutDate, 'PP'),
        size: 2,
      },
      {
        sortable: false,
        label: 'Room',
        key: 'roomNumber',
        size: 2,
        transform: (reservation: IReservation) =>
          String(reservation.room.number),
      },
    ] as TableColumn[],
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
      room: null,
      checkInDate: format(reservationsPageState.selectedDay, 'PP'),
      duration: 1,
      roomTypeId: reservationsPageState.roomTypes[0].id,
    });
  };

  const editReservation = (reservation: IReservation) => {
    setIsSidePanelVisible(true);

    reset({
      firstName: reservation.guest.firstName,
      lastName: reservation.guest.lastName,
      email: reservation.guest.email,
      room: reservation.room,
      roomTypeId: reservation.room.roomType.id,
      checkInDate: reservation.checkInDate,
      duration: Math.abs(
        differenceInDays(
          new Date(reservation.checkInDate),
          new Date(reservation.checkOutDate)
        )
      ),
      id: reservation.id,
    });
  };

  const onCloseSidePanel = () => setIsSidePanelVisible(false);

  const onConfirmSidePanel = (reservationFormData: ReservationFormData) => {
    if (!reservationFormData) {
      return;
    }

    const { firstName, lastName, email, room, checkInDate, duration } =
      reservationFormData;

    if (reservationFormData.id) {
      apiReservationService
        .updateReservation(reservationFormData.id, {
          firstName,
          lastName,
          email,
          roomNumber: room?.number ?? null,
          checkInDate,
          checkOutDate: format(
            addDays(
              checkInDate ? new Date(checkInDate) : new Date(),
              Number(duration)
            ),
            'P'
          ),
        })
        .then(({ data }) => {
          reservationsPageDispatch({
            type: ReservationsPageActionTypes.updateReservationsListView,
            payload: {
              reservations: {
                ...reservationsPageState.reservations,
                items: reservationsPageState.reservations.items.map(
                  (reservation: IReservation) => {
                    if (reservation.id === reservationFormData.id) {
                      return {
                        ...reservation,
                        guest: {
                          ...reservation.guest,
                          firstName,
                          lastName,
                          email,
                        },
                        room: {
                          ...reservation.room,
                          number: room?.number,
                        },
                      } as IReservation;
                    }

                    return reservation;
                  }
                ),
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
        .createReservation({
          firstName,
          lastName,
          email,
          roomNumber: room?.number ?? null,
          checkInDate,
          checkOutDate: format(
            addDays(
              checkInDate ? new Date(checkInDate) : new Date(),
              Number(duration)
            ),
            'P'
          ),
        })
        .then(({ data }: { data: IReservation }) => {
          if (
            isWithinInterval(reservationsPageState.selectedDay, {
              start: data.checkInDate,
              end: data.checkOutDate,
            })
          ) {
            reservationsPageDispatch({
              type: ReservationsPageActionTypes.updateReservationsListView,
              payload: {
                reservations: {
                  ...reservationsPageState.reservations,
                  items: [...reservationsPageState.reservations.items, data],
                  meta: {
                    ...reservationsPageState.reservations.meta,
                    totalItems:
                      reservationsPageState.reservations.meta.totalItems + 1,
                  },
                },
              },
            });
          }

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
              message: 'Failed booking reservation.',
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

  const goToNextPage = () => {
    goToPageHandler(reservationsPageState.reservations.meta.currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPageHandler(reservationsPageState.reservations.meta.currentPage - 1);
  };

  const selectDayHandler = (day: Date) => {
    reservationDataQueryParams = {
      ...reservationDataQueryParams,
      date: format(day, 'P'),
    };

    reservationsPageDispatch({
      type: ReservationsPageActionTypes.updateDaySelection,
      payload: {
        selectedDay: day,
      },
    });

    fetchReservationData();
  };

  const toggleDateSelectionPicker = () => {
    setIsDateSelectionVisible(!isDateSelectionVisible);
  };

  const updateDaySelectionRange = (selectedDay: Date) => {
    setIsDateSelectionVisible(false);
    selectDayHandler(selectedDay);
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
      apiRoomTypeService.getRoomTypes({ hotel: hotel?.id ?? '' }),
    ])
      .then(([reservationsDataResponse, roomTypesDataResponse]) => {
        reservationsPageDispatch({
          type: ReservationsPageActionTypes.pageLoad,
          payload: {
            roomTypes: roomTypesDataResponse.data,
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
    <section className={styles.reservations}>
      <section className={styles.main}>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3 items-center">
            <Popover
              open={isDateSelectionVisible}
              content={
                <Datepicker
                  defaultDate={reservationsPageState.selectedDay}
                  inline
                  showClearButton={false}
                  onSelectedDateChanged={updateDaySelectionRange}
                />
              }
            >
              <button
                type="button"
                className="flex flex-row gap-3 items-center"
                onClick={toggleDateSelectionPicker}
              >
                <h1 className={styles.reservationSelectedDateTitle}>
                  {format(reservationsPageState.selectedDay, 'PP')}
                </h1>
                <IoChevronDown></IoChevronDown>
              </button>
            </Popover>
          </div>
          <div className="flex flex-row mb-3">
            <button
              className="buttonPrimary w-56 flex flex-row gap-3 justify-center items-center"
              onClick={createReservation}
            >
              <span>Create Reservation</span>
              <span>
                <LuBookPlus />
              </span>
            </button>
          </div>
        </div>
        <DaySelectionFrame
          initialSelectedDay={reservationsPageState.selectedDay}
          onSelectDayHandler={selectDayHandler}
        ></DaySelectionFrame>
        <Table
          items={reservationsPageState.reservations.items}
          idKey="id"
          columns={tableConfig.columns}
          itemActions={tableConfig.itemActions}
          isLoading={reservationsPageState.isLoading}
          pagination={{
            ...reservationsPageState.reservations.meta,
            goToNextPage,
            goToPreviousPage,
          }}
        ></Table>
      </section>
      <SidePanel
        isVisible={isSidePanelVisible}
        onClose={onCloseSidePanel}
        width={800}
      >
        <SidePanelHeader onClose={onCloseSidePanel}>
          <div>Book a Reservation</div>
        </SidePanelHeader>
        <SidePanelBody>
          <ReservationForm
            roomTypes={reservationsPageState.roomTypes}
            hotelId={hotel?.id ?? ''}
            watch={watch}
            register={register}
            formState={formState}
            getValues={getValues}
            control={control}
            setValue={setValue}
            defaultCheckInDate={initialPageState.selectedDay}
            handleSubmit={handleSubmit(onConfirmSidePanel)}
          ></ReservationForm>
        </SidePanelBody>
      </SidePanel>
    </section>
  );
}

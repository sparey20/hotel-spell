import styles from './index.module.scss';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import * as apiRoomTypeService from '../../lib/features/roomType/apiRoomTypeService';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  IAPIListView,
  ICreateRoomDTO,
  IHotel,
  IRoom,
  IRoomType,
  RoomStatus,
} from '@hotel-spell/api-interfaces';
import {
  ItemAction,
  ListViewTableColumn,
} from '../../components/list-view/types';
import ListView from '../../components/list-view/ListView';
import SidePanel from '../../components/list-view/SidePanel';
import { set, useForm } from 'react-hook-form';
import { GetRoomsParams } from '../../lib/features/room/apiRoomService';
import { showToastWithTimeout } from '../../lib/features/toast/toastSlice';
import { TableColumn } from '../../components/table/Table';
import { TableProps } from 'flowbite-react/dist/types/components/Table';

interface RoomsPageState {
  roomData: IAPIListView<IRoom>;
  isLoading: boolean;
  roomTypes: IRoomType[];
}

enum RoomsPageActionTypes {
  pageLoad = 'PAGE_LOAD',
  updateRoomsListView = 'UPDATE_ROOMS_LIST_VIEW',
}

interface RoomFormData {
  id?: string;
  number: number | null;
  roomType: string | null;
  status: RoomStatus | null;
}

type RoomsPageAction =
  | {
      type: RoomsPageActionTypes.pageLoad;
      payload: { roomData: IAPIListView<IRoom>; roomTypes: IRoomType[] };
    }
  | {
      type: RoomsPageActionTypes.updateRoomsListView;
      payload: { roomData: IAPIListView<IRoom> };
    };

const roomsPageReducerMap = new Map<
  RoomsPageActionTypes,
  (state: RoomsPageState, action: RoomsPageAction) => RoomsPageState
>([
  [
    RoomsPageActionTypes.pageLoad,
    (state: RoomsPageState, action: RoomsPageAction): RoomsPageState =>
      action.type === RoomsPageActionTypes.pageLoad
        ? {
            roomData: action.payload.roomData,
            roomTypes: action.payload.roomTypes,
            isLoading: false,
          }
        : state,
  ],
  [
    RoomsPageActionTypes.updateRoomsListView,
    (state: RoomsPageState, action: RoomsPageAction) =>
      action.type === RoomsPageActionTypes.updateRoomsListView
        ? {
            ...state,
            roomData: action.payload.roomData,
            isLoading: false,
          }
        : state,
  ],
]);

const roomsPageReducer = (
  state: RoomsPageState,
  action: RoomsPageAction
): RoomsPageState => {
  const mappedAction = roomsPageReducerMap.get(action.type);

  if (!mappedAction) {
    return state;
  }

  return mappedAction(state, action);
};

const listViewItemPerPage = 20;

const initialPageState: RoomsPageState = {
  roomData: {
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
};

const roomStatusLabelMappings: Record<RoomStatus, string> = {
  [RoomStatus.AVAILABLE]: 'Available',
  [RoomStatus.UNAVAILABLE]: 'Unavailable',
  [RoomStatus.NEEDS_CLEANING]: 'Needs Cleaning',
  [RoomStatus.NEEDS_SERVICING]: 'Needs Servicing',
};

export default function RoomsComponent() {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };

  let roomDataQueryParams: GetRoomsParams = {
    hotel: hotel?.id as string,
    page: 1,
    sortColumn: 'number',
    sortDirection: 'asc',
    limit: listViewItemPerPage,
    search: '',
  };

  const dispatch = useAppDispatch();

  const [roomsPageState, roomsPageDispatch] = useReducer(
    roomsPageReducer,
    initialPageState
  );

  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const { register, handleSubmit, reset, getValues, trigger, formState } =
    useForm<RoomFormData>({
      mode: 'onBlur',
      defaultValues: {
        number: null,
        roomType: null,
        status: null,
      },
    });

  const tableConfig = {
    columns: [
      {
        key: 'number',
        label: 'Number',
        size: 3,
        sortable: true,
        sorting: {
          direction: 'asc',
          isDefault: true,
        },
      },
      {
        key: 'status',
        label: 'Status',
        size: 3,
        sortable: true,
        sorting: null,
        transform: (item: IRoom) => roomStatusLabelMappings[item.status] ?? '',
      },
      {
        key: 'roomType',
        label: 'Type',
        size: 3,
        sortable: true,
        sorting: null,
        transform: (item: IRoom) => item?.roomType?.name ?? '',
      },
    ] as ListViewTableColumn[],
    itemActions: [
      {
        label: 'Edit',
        action: (room: IRoom) => editRoom(room),
      },
      {
        label: 'Delete',
        action: (room: IRoom) => deleteItem(room),
      },
    ] as ItemAction[],
  };

  const createRoom = () => {
    setIsSidePanelVisible(true);
    reset({
      number: null,
      roomType: null,
    });
  };

  const editRoom = (room: IRoom) => {
    setIsSidePanelVisible(true);
    reset({
      ...room,
      roomType: room.roomType?.id,
    });
  };

  const onCloseSidePanel = () => setIsSidePanelVisible(false);

  const onConfirmSidePanel = (roomFormData: RoomFormData) => {
    if (!roomFormData) {
      return;
    }

    if (roomFormData.id) {
      apiRoomService
        .editRoom(roomFormData.id, {
          number: roomFormData.number ?? 0,
          status: roomFormData.status ?? RoomStatus.AVAILABLE,
          roomTypeId: roomFormData.roomType ?? '',
        })
        .then(({ data }) => {
          roomsPageDispatch({
            type: RoomsPageActionTypes.updateRoomsListView,
            payload: {
              roomData: {
                ...roomsPageState.roomData,
                items: roomsPageState.roomData.items.map((room: IRoom) => {
                  if (room.id === roomFormData.id) {
                    return {
                      ...room,
                      number: roomFormData.number ?? 0,
                      status: roomFormData.status ?? RoomStatus.AVAILABLE,
                      roomType: roomsPageState.roomTypes.find(
                        (roomType) => roomType.id === roomFormData.roomType
                      ) as IRoomType,
                    };
                  }

                  return room;
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
      apiRoomService
        .createRoom({
          number: roomFormData.number ?? 0,
          status: roomFormData.status ?? RoomStatus.AVAILABLE,
          roomTypeId: roomFormData.roomType ?? '',
        })
        .then(({ data }) => {
          dispatch(
            showToastWithTimeout({
              message: `Created room number ${roomFormData.number}`,
              type: 'success',
            }) as any
          );
        })
        .catch((error) => {
          dispatch(
            showToastWithTimeout({
              message: 'Failed creating a room',
              type: 'error',
            }) as any
          );
        });
    }

    setIsSidePanelVisible(false);
  };

  const deleteItem = (room: IRoom) => {
    apiRoomService
      .deleteRoom(room.id as string)
      .then(() => {
        roomsPageDispatch({
          type: RoomsPageActionTypes.updateRoomsListView,
          payload: {
            roomData: {
              ...roomsPageState.roomData,
              items: roomsPageState.roomData.items.filter(
                (roomItem) => roomItem.id !== room.id
              ),
            },
          },
        });

        dispatch(
          showToastWithTimeout({
            message: `Deleted room number ${room.number}`,
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

  const fetchRoomData = () => {
    apiRoomService
      .getRooms(roomDataQueryParams)
      .then(({ data }) => {
        roomsPageDispatch({
          type: RoomsPageActionTypes.updateRoomsListView,
          payload: {
            roomData: {
              ...roomsPageState.roomData,
              items: data.items,
              meta: data.meta,
            },
          },
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting room data.',
            type: 'error',
          }) as any
        );
      });
  };

  const goToPageHandler = (currentPage: number) => {
    roomDataQueryParams = {
      ...roomDataQueryParams,
      page: currentPage,
    };

    fetchRoomData();
  };

  const sortColumnHandler = (column: string, direction: 'asc' | 'desc') => {
    roomDataQueryParams = {
      ...roomDataQueryParams,
      sortColumn: column,
      sortDirection: direction,
    };

    fetchRoomData();
  };

  const searchItemsHandler = (search: string) => {
    roomDataQueryParams = {
      ...roomDataQueryParams,
      search,
    };

    fetchRoomData();
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
      apiRoomTypeService.getRoomTypes({ hotel: hotel.id as string }),
      apiRoomService.getRooms(roomDataQueryParams),
    ])
      .then(([roomTypesResponse, roomDataResponse]) => {
        roomsPageDispatch({
          type: RoomsPageActionTypes.pageLoad,
          payload: {
            roomTypes: roomTypesResponse.data,
            roomData: roomDataResponse.data,
          } as RoomsPageState,
        });
      })
      .catch((error) => {
        dispatch(
          showToastWithTimeout({
            message: 'Failed getting room data.',
            type: 'error',
          }) as any
        );
      });
  }, []);

  return (
    <>
      <ListView
        entityName="Rooms"
        config={tableConfig}
        isLoading={roomsPageState.isLoading}
        data={roomsPageState.roomData}
        goToPageHandler={goToPageHandler}
        sortColumnHandler={sortColumnHandler}
        searchItemsHandler={searchItemsHandler}
        createItemHandler={createRoom}
      ></ListView>
      <SidePanel
        isVisible={isSidePanelVisible}
        header="Create Room"
        onClose={onCloseSidePanel}
        onConfirm={handleSubmit(onConfirmSidePanel)}
      >
        <form className="flex flex-col gap-4">
          <label>Room Number</label>
          <input
            className={`formInput ${formState.errors.number ? 'error' : ''}`}
            type="number"
            {...register('number', {
              required: true,
            })}
          />
          <label>Type</label>
          <select
            className={`formInput ${formState.errors.roomType ? 'error' : ''}`}
            {...register('roomType', { required: true })}
          >
            {roomsPageState.roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
          <label>Status</label>
          <select
            className={`formInput ${formState.errors.roomType ? 'error' : ''}`}
            {...register('status', { required: true })}
          >
            {Object.entries(roomStatusLabelMappings).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </form>
      </SidePanel>
    </>
  );
}

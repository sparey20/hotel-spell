import styles from './index.module.scss';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import * as apiRoomTypeService from '../../lib/features/roomType/apiRoomTypeService';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import {
  ICreateRoomDTO,
  IHotel,
  IRoom,
  IRoomType,
} from '@hotel-spell/api-interfaces';
import {
  ItemAction,
  ListViewItem,
  ListViewTableColumn,
} from '../../components/list-view/types';
import ListView from '../../components/list-view/ListView';
import SidePanel from '../../components/list-view/SidePanel';
import { set, useForm } from 'react-hook-form';

export default function RoomsComponent() {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const { register, handleSubmit, reset, getValues, trigger, formState } =
    useForm<any>({
      mode: 'onBlur',
      defaultValues: {
        number: null,
        roomType: null,
      },
    });
  const [roomTypes, setRoomTypes] = useState<IRoomType[]>([]);

  const tableConfig = {
    rowLimit: 20,
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
        key: 'roomType',
        label: 'Type',
        size: 3,
        sortable: true,
        sorting: null,
      },
    ] as ListViewTableColumn[],
    itemActions: [
      {
        label: 'Edit',
        action: (item: any) => {
          openSidePanel();
        },
      },
      {
        label: 'Delete',
        action: (item: any) => deleteItem(item),
      },
    ] as ItemAction[],
  };

  const openSidePanel = () => setIsSidePanelVisible(true);

  const onCloseSidePanel = () => setIsSidePanelVisible(false);

  const onConfirmSidePanel = (createRoomDTO: ICreateRoomDTO) => {
    if (!createRoomDTO) {
      return;
    }

    apiRoomService.createRoom(createRoomDTO).then(({ data }) => {
      console.log('Room created', data);
    });

    setIsSidePanelVisible(false);
  };

  const fetchDataRequest = (params: any) =>
    apiRoomService.getRooms({
      hotel: hotel?.id as string,
      ...params,
    });

  const deleteDataRequest = apiRoomService.deleteRoom;

  const mapDataToTableItems = useMemo(
    () =>
      (rooms: IRoom[]): ListViewItem[] =>
        rooms.map(({ id, number, roomType }) => ({
          id,
          number,
          roomType: roomType?.name || '',
        })),
    []
  );

  const deleteItem = (item: IRoom) => {
    console.log('delete item', item);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState]);

  useEffect(() => {
    if (hotel) {
      apiRoomTypeService
        .getRoomTypes({ hotel: hotel.id as string })
        .then(({ data }) => setRoomTypes(data));
    }
  }, []);

  return (
    <>
      <ListView
        entityName="Rooms"
        config={tableConfig}
        fetchDataRequest={fetchDataRequest}
        deleteItemRequest={deleteDataRequest}
        mapDataToTableItems={mapDataToTableItems}
        createItemHandler={openSidePanel}
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
          <label>Room Type</label>
          <select
            className={`formInput ${formState.errors.roomType ? 'error' : ''}`}
            {...register('roomType', { required: true })}
          >
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
        </form>
      </SidePanel>
    </>
  );
}

import { IRoom } from '@hotel-spell/api-interfaces';
import styles from './index.module.scss';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  ModalFooter,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import CardLoader from '../../components/loaders/CardLoader';

type RoomSelectionModalProps = {
  roomSelectionRequestParams: {
    hotel: string;
    startDate: string;
    endDate: string;
    roomTypeId: string;
  };
  isRoomSelectionModalVisable: boolean;
  room: IRoom | null;
  onClose: (room: IRoom | null) => void;
};

export default function RoomSelectionModal({
  isRoomSelectionModalVisable,
  roomSelectionRequestParams,
  room,
  onClose,
}: RoomSelectionModalProps) {
  const [availableRooms, setAvailableRooms] = useState<IRoom[]>([]);
  const [isAvailableRoomLoading, setIsAvailableRoomLoading] =
    useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(room);

  useEffect(() => {
    if (isRoomSelectionModalVisable) {
      setIsAvailableRoomLoading(true);

      apiRoomService
        .getAvailableRooms(roomSelectionRequestParams)
        .then(({ data }) => {
          setAvailableRooms(data);
          setIsAvailableRoomLoading(false);
        });
    }
  }, [isRoomSelectionModalVisable]);

  const selectRoom = (room: IRoom) => {
    setSelectedRoom(room);
  };

  const closeRoomSelectionModal = () => {
    onClose(null);
  };

  const confirmRoomSelectionModal = () => {
    onClose(selectedRoom);
  }

  return (
    <Modal
      onClose={closeRoomSelectionModal}
      show={isRoomSelectionModalVisable}
      size="4xl"
    >
      <ModalHeader>Search Avaialble Rooms</ModalHeader>
      <ModalBody>
        <div className={styles.roomListContainer}>
          <ul className={styles.roomList}>
            {isAvailableRoomLoading &&
              Array.from({ length: 14 }, (_, index) => index).map(
                (_, index) => (
                  <li key={index}>
                    <CardLoader></CardLoader>
                  </li>
                )
              )}
            {!isAvailableRoomLoading &&
              availableRooms.map((room) => (
                <li
                  key={room.id}
                  className={
                    room.id === selectedRoom?.id ? styles.selected : ''
                  }
                >
                  <Card
                    onClick={() => selectRoom(room)}
                    className="w-full"
                    imgSrc="https://picsum.photos/400/400"
                  >
                    <div className="flex-row flex justify-between items-center">
                      <div className="flex flex-col w-full">
                        <h5>{room.roomType.name}</h5>
                        <p>Number: {room.number}</p>
                        <p>Bed Config: {room.roomType.bedConfiguration}</p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-row justify-end w-full gap-5">
          <button
            type="button"
            className="buttonPrimary w-32"
            onClick={confirmRoomSelectionModal}
            disabled={!selectedRoom}
          >
            <span>Confirm</span>
          </button>
          <button
            type="button"
            className="buttonDefault w-32"
            onClick={closeRoomSelectionModal}
          >
            <span>Close</span>
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

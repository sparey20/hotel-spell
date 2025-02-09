import styles from './index.module.scss';
import { IRoom, IRoomType } from '@hotel-spell/api-interfaces';
import { addDays } from 'date-fns';
import { format } from 'date-fns/format';
import {
  Accordion,
  AccordionPanel,
  AccordionTitle,
  AccordionContent,
  Datepicker,
  TextInput,
  Select,
  Card,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  FormState,
  useForm,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import {
  LuCloudMoon,
  LuBed,
  LuSearch,
  LuPencil,
  LuMail,
  LuPhone,
} from 'react-icons/lu';
import * as apiRoomService from '../../lib/features/room/apiRoomService';
import { ReservationFormData } from '.';
import { IoCloseOutline } from 'react-icons/io5';
import RoomSelectionModal from './RoomSelectionModal';

type ReservationFormProps = {
  roomTypes: IRoomType[];
  hotelId: string;
  defaultCheckInDate: Date;
  watch: UseFormWatch<ReservationFormData>;
  control: Control<ReservationFormData, any>;
  getValues: UseFormGetValues<ReservationFormData>;
  register: UseFormRegister<ReservationFormData>;
  formState: FormState<ReservationFormData>;
  setValue: UseFormSetValue<ReservationFormData>;
  handleSubmit: any;
};

export default function ReservationForm({
  roomTypes,
  hotelId,
  watch,
  control,
  getValues,
  register,
  formState,
  setValue,
  handleSubmit,
}: ReservationFormProps) {
  const [isRoomSelectionModalVisable, setIsRoomSelectionModalVisable] =
    useState<boolean>(false);

  const formCheckInDateValue = watch('checkInDate');
  const formDurationValue = watch('duration', 1);
  const formRoomTypeIdValue = watch('roomTypeId');
  const formReservationIdValue = watch('id')
  const formattedCheckOutDate = format(
    addDays(new Date(formCheckInDateValue ?? ''), Number(formDurationValue)),
    'PP'
  );
  const formRoomValue = watch('room');

  const openRoomSelectionModal = () => {
    setIsRoomSelectionModalVisable(true);
  };

  const closeRoomSelectionModal = (room: IRoom | null) => {
    if (room) {
      setValue('room', room, { shouldValidate: true });
    }

    setIsRoomSelectionModalVisable(false);
  };

  const clearRoomSelection = () => {
    removeSelectedRoom();
  };

  const removeSelectedRoom = () => {
    setValue('room', null);
  };

  const onChangeResetRoomSelection = (
    event: any,
    onChange: (...event: any[]) => void
  ) => {
    clearRoomSelection();
    onChange(event);
  };

  return (
    <>
      <form className={styles.reservationForm}>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col w-full gap-2">
                <label className="font-semibold">Check In Date</label>
                <Controller
                  name="checkInDate"
                  control={control}
                  defaultValue={getValues('checkInDate')}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Datepicker
                      sizing="lg"
                      defaultDate={new Date(value as string)}
                      onSelectedDateChanged={(event) =>
                        onChangeResetRoomSelection(event, onChange)
                      }
                    />
                  )}
                ></Controller>
              </div>
              <div className="flex flex-col w-full gap-2">
                <label className="font-semibold">Duration (Nights)</label>
                <Controller
                  name="duration"
                  control={control}
                  defaultValue={getValues('duration')}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      type="number"
                      sizing="lg"
                      icon={LuCloudMoon}
                      value={value ?? 0}
                      onChange={(event) =>
                        onChangeResetRoomSelection(event, onChange)
                      }
                    ></TextInput>
                  )}
                ></Controller>
              </div>
              <div className="flex flex-col w-full gap-4">
                <p className="font-semibold">Checkout Date</p>
                <p>{formattedCheckOutDate}</p>
              </div>
            </div>
            <div className="border-t border-emerald-700 py-6 flex flex-col gap-5">
              <h3 className="text-2xl font-bold">Room Details</h3>
              <div className="flex flex-row items-end gap-2 w-full">
                <div className="flex flex-col gap-3 w-full">
                  <label className="font-semibold">Room Type</label>
                  <Controller
                    name="roomTypeId"
                    control={control}
                    defaultValue={getValues('roomTypeId')}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        icon={LuBed}
                        sizing="lg"
                        onChange={(event) =>
                          onChangeResetRoomSelection(event, onChange)
                        }
                        value={value ?? ''}
                      >
                        <option disabled>Room Type *</option>
                        {roomTypes.map((roomType) => (
                          <option key={roomType.id} value={roomType.id}>
                            {roomType.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  ></Controller>
                </div>
              </div>
              <div className="flex flex-col justify-start gap-3">
                <label className="font-semibold">Room Number</label>
                {formRoomValue && (
                  <div className="flex flex-row gap-3">
                    <p>{formRoomValue.number}</p>
                    <button
                      type="button"
                      className="buttonIcon"
                      onClick={openRoomSelectionModal}
                    >
                      <LuPencil></LuPencil>
                    </button>
                  </div>
                )}
                {!formRoomValue && (
                  <button
                    type="button"
                    className="buttonPrimary flex flex-row gap-3 items-center w-64"
                    onClick={openRoomSelectionModal}
                  >
                    <LuSearch></LuSearch>
                    <span>Search for available rooms</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 py-6 flex flex-col gap-5">
            <h3 className="text-2xl font-bold">Guest Details</h3>
            <div className="flex flex-row gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <label className="font-semibold">First Name</label>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={getValues('firstName')}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      type="text"
                      sizing="lg"
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="Bob"
                    ></TextInput>
                  )}
                ></Controller>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <label className="font-semibold">Last Name</label>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={getValues('lastName')}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      type="text"
                      sizing="lg"
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="Jones"
                    ></TextInput>
                  )}
                ></Controller>
              </div>
            </div>
            <div className="flex flex-row gap-3 w-full">
              <div className="flex flex-col gap-3 w-full">
                <label className="font-semibold">Email</label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={getValues('email')}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      type="text"
                      sizing="lg"
                      icon={LuMail}
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="bob.jones@gmail.com"
                    ></TextInput>
                  )}
                ></Controller>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <label>Phone</label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue={getValues('phone')}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      type="text"
                      sizing="lg"
                      icon={LuPhone}
                      value={value ?? ''}
                      onChange={onChange}
                      placeholder="342-131-0000"
                    ></TextInput>
                  )}
                ></Controller>
              </div>
            </div>
          </div>
          <input type="hidden" {...register('id')} />
        </div>

        <footer>
          <button
            type="button"
            disabled={!formState.isValid || !formRoomValue}
            className="buttonPrimary w-full h-14 text-2xl font-bold"
            onClick={handleSubmit}
          >
            {formReservationIdValue && 'Update Reservation'}
            {!formReservationIdValue && 'Book Room'}
          </button>
        </footer>
      </form>

      <RoomSelectionModal
        roomSelectionRequestParams={{
          hotel: hotelId,
          startDate: formCheckInDateValue ?? '',
          endDate: format(formattedCheckOutDate, 'P'),
          roomTypeId: formRoomTypeIdValue ?? '',
        }}
        isRoomSelectionModalVisable={isRoomSelectionModalVisable}
        room={formRoomValue}
        onClose={closeRoomSelectionModal}
      ></RoomSelectionModal>
    </>
  );
}

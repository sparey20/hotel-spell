import { IRoom } from '@hotel-spell/api-interfaces';
import { format } from 'date-fns';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from '../../../../components/modal/modal';
import * as apiReservationService from '../../../../lib/features/reservation/apiReservationService';

export type ReservationFormModalProps = {
  rooms: IRoom[];
  reservationSubmit: SubmitHandler<apiReservationService.ReservationDTO>;
};

const ReservationFormModal = forwardRef(
  (props: ReservationFormModalProps, ref) => {
    const { rooms, reservationSubmit } = props;
    const today = format(new Date(), 'yyyy-MM-dd');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const { register, handleSubmit, reset, getValues, trigger, formState } =
      useForm<apiReservationService.ReservationDTO>({
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

    useEffect(() => {
      if (formState.isSubmitSuccessful) {
        reset();
      }
    }, [formState]);

    const openReservationModal = (formData: any = null) => {
      console.log('opening reservation modal', formData);
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

    const closeReservationModal = () => {
      setIsModalVisible(false);
    };

    useImperativeHandle(ref, () => ({
      openReservationModal,
      closeReservationModal,
    }));

    return (
      <Modal
        isVisible={isModalVisible}
        header="Create or Edit a Reservation"
        onClose={closeReservationModal}
        onConfirm={handleSubmit(reservationSubmit)}
      >
        <section className="flex flex-col">
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
              {rooms.map((room) => (
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
    );
  }
);

ReservationFormModal.displayName = 'ReservationFormModal';

export default ReservationFormModal;

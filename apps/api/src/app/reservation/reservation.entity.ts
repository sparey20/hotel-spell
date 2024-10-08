import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { Guest } from '../guest/guest.entity';

export enum ReservationStatus { 
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'Reservation' })
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'checkInDate', type: 'date' })
  checkInDate: string;

  @Column({ name: 'checkOutDate', type: 'date' })
  checkOutDate: string;

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updatedDate: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
    nullable: false,
  })
  status: ReservationStatus;

  @Column({ type: 'boolean', default: false })
  isCheckedIn: boolean;

  @ManyToOne(() => Room)
  @JoinColumn()
  room: Room;

  @OneToOne(() => Guest)
  @JoinColumn()
  guest: Guest;
}

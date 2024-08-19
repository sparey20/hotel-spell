import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Reservation } from '../reservation/reservation.entity';
import { RoomType } from '../roomType/roomType.entity';

export enum RoomStatus {
  NEEDS_CLEANING = 'needsCleaning',
  NEEDS_SERVICING = 'needsServicing',
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

@Entity({ name: 'Room' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'number', type: 'int', nullable: false })
  number: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn()
  hotel: Hotel;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
    nullable: false,
  })
  status: RoomStatus;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn()
  roomType: RoomType;
}

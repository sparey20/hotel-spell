import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Reservation } from '../reservation/reservation.entity';

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
}

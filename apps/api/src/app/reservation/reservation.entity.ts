import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { Guest } from '../guest/guest.entity';

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

  @ManyToOne(() => Room)
  @JoinColumn()
  room: Room;

  @OneToOne(() => Guest)
  @JoinColumn()
  guest: Guest;
}

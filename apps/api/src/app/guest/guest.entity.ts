import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';

@Entity({ name: 'Guest' })
export class Guest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstName', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 200, nullable: false })
  email: string;

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updatedDate: string;

  @OneToOne(() => Reservation, (reservation) => reservation.guest)
  reservation: Reservation;
}

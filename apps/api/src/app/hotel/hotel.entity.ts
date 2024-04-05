import { Room } from './../room/room.entity';
import { Reservation } from './../reservation/reservation.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'Hotel' })
export class Hotel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 550 })
  description: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({ name: 'postal', type: 'varchar', length: 10, nullable: false })
  postal: number;

  @Column({ name: 'city', type: 'varchar', length: 100, nullable: false })
  city: string;

  @Column({ name: 'state', type: 'varchar', length: 2, nullable: false })
  state: string;

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updatedDate: string;

  @OneToMany(() => User, (user) => user.hotel)
  users: User[];

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}

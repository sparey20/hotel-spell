import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';

@Entity({ name: 'User' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstName', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 200, nullable: false })
  email: string;

  @Column({ name: 'username', type: 'varchar', length: 200, nullable: false })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 50, nullable: false })
  password: string;

  @Column({ name: 'admin', type: 'boolean' })
  admin: boolean;

  @CreateDateColumn()
  createdDate: string;

  @UpdateDateColumn()
  updatedDate: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.users)
  @JoinColumn()
  hotel: Hotel;
}

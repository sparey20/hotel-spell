import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { Amenity } from '../amenities/amenity.entity';
import { Hotel } from '../hotel/hotel.entity';
import { BedConfiguration } from '@hotel-spell/api-interfaces';

@Entity({ name: 'RoomType' })
export class RoomType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'rate',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  rate: number;

  @Column({
    name: 'squareFootage',
    type: 'numeric',
    nullable: false,
  })
  squareFootage: number;

  @Column({
    name: 'maxGuests',
    type: 'numeric',
    nullable: false,
  })
  maxGuests: number;

  @Column({
    name: 'bedConfiguration',
    type: 'enum',
    nullable: false,
    enum: BedConfiguration,
  })
  bedConfiguration: BedConfiguration;

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];

  @ManyToMany(() => Amenity, (amenity) => amenity.roomTypes)
  @JoinTable()
  amenities: Amenity[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn()
  hotel: Hotel;
}

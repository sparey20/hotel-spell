import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomType } from '../roomType/roomType.entity';

export enum AmenityCategory {
  GENERAL = 'general',
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  FOOD_DRINK = 'foodDrink',
  ENTERTAINMENT = 'entertainment',
}

@Entity({ name: 'Amenity' })
export class Amenity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'category',
    type: 'enum',
    enum: AmenityCategory,
    nullable: false,
  })
  category: AmenityCategory;

  @ManyToMany(() => RoomType, (roomType) => roomType.amenities)
  roomTypes: RoomType[];
}

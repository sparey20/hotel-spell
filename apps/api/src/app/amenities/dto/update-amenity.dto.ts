import { IsEnum, IsString } from 'class-validator';
import { AmenityCategory } from '../amenity.entity';

export class UpdateAmenityDto {
  @IsString()
  name: string;

  @IsEnum(AmenityCategory)
  category: AmenityCategory;
}

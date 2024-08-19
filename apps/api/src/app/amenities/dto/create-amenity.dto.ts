import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AmenityCategory } from '../amenity.entity';

export class CreateAmenityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AmenityCategory)
  @IsNotEmpty()
  category: AmenityCategory;
}

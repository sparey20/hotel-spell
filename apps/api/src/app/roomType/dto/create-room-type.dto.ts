import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BedConfiguration } from '../roomType.entity';

export class CreateRoomTypeDto {
  @IsUUID()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsNotEmpty()
  rate: number;

  @IsNumber()
  @IsNotEmpty()
  squareFootage: number;

  @IsNumber()
  @IsNotEmpty()
  maxGuests: number;

  @IsEnum(BedConfiguration, { message: 'Invalid bed configuration' })
  @IsNotEmpty()
  bedConfiguration: BedConfiguration;

  @IsUUID(4, {
    each: true,
  })
  amenityIds: string[];
}

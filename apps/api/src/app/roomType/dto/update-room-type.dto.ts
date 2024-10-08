import { BedConfiguration } from '@hotel-spell/api-interfaces';
import { IsArray, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateRoomTypeDto {
  @IsString()
  name: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  rate: number;

  @IsNumber()
  squareFootage: number;

  @IsNumber()
  maxGuests: number;

  @IsEnum(BedConfiguration, { message: 'Invalid bed configuration' })
  bedConfiguration: BedConfiguration;

  @IsUUID(4, {
    each: true,
  })
  amenityIds: string[];
}

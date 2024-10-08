import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class RoomFindParams {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumberString()
  @IsOptional()
  limit: number | string = 1;

  @IsNumberString()
  @IsOptional()
  page: number | string = 10;

  @IsIn(['id', 'number'])
  @IsOptional()
  sortColumn: 'id' | 'number';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortDirection: 'asc' | 'desc';
}

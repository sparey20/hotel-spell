import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReservationFindParams {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsDateString()
  @IsOptional()
  date?: string = '';

  @IsString()
  @IsOptional()
  search?: string = '';

  @IsNumberString()
  @IsOptional()
  room?: number = null;

  @IsNumberString()
  @IsOptional()
  limit: number | string = 1;

  @IsNumberString()
  @IsOptional()
  page: number | string = 10;

  @IsIn(['id', 'checkInDate', 'checkOutDate'])
  @IsOptional()
  sortColumn: 'id' | 'checkInDate' | 'checkOutDate';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortDirection: 'asc' | 'desc';
}

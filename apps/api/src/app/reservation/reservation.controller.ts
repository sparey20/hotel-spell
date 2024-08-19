import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {} from 'nestjs-typeorm-paginate';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get('by-day')
  calculateReservationsByDay(
    @Query('hotel') hotelId: string,
    @Query('startDate', new DefaultValuePipe(null)) startDate: string,
    @Query('endDate', new DefaultValuePipe(null)) endDate: string
  ) {
    return this.reservationService.calculateReservationsByDay({
      hotelId,
      startDate,
      endDate,
    });
  }

  @Get()
  findAll(
    @Query('hotel') hotelId: string,
    @Query('checkInDate', new DefaultValuePipe(null)) checkInDate: string,
    @Query('checkOutDate', new DefaultValuePipe(null)) checkOutDate: string,
    @Query('isActive', new DefaultValuePipe(false)) isActive: boolean,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('room', new DefaultValuePipe(null)) room: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sortDirection', new DefaultValuePipe('')) sortDirection,
    @Query('sortColumn', new DefaultValuePipe(null)) sortColumn
  ) {
    return this.reservationService.findAll({
      hotelId,
      checkInDate,
      checkOutDate,
      isActive,
      search,
      room,
      page,
      limit,
      sortDirection,
      sortColumn,
    });
  }

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: Partial<UpdateReservationDto>
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reservationService.delete(id);
  }
}

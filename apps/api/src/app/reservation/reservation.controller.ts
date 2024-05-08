import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  findAll(
    @Query('hotel') hotelId: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
    @Query('isActive') isActive: boolean,
    @Query('search') search: string,
    @Query('room') room: number
  ) {
    return this.reservationService.findAll({
      hotelId: hotelId ?? null,
      checkInDate: checkInDate ?? null,
      checkOutDate: checkOutDate ?? null,
      isActive: isActive ?? false,
      search: search ?? '',
      room: room ?? null,
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
  update(@Param('id') id: string, @Body() updateReservationDto: CreateReservationDto) {
    return this.reservationService.update(id, updateReservationDto)
  }
}

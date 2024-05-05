import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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
    @Query('isActive') isActive: boolean
  ) {
    return this.reservationService.findAll({
      hotelId: hotelId ?? null,
      checkInDate: checkInDate ?? null,
      checkOutDate: checkOutDate ?? null,
      isActive: isActive ?? false,
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
}

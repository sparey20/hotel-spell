import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }
}

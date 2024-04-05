import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Get(':id/reservations')
  findReservations(@Param('id') id: string) {
    return this.roomService.findHotelReservations(id);
  }
}

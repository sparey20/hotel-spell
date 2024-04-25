import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(id);
  }

  @Get(':id/users')
  findHotelUsers(@Param('id') id: string) {
    return this.hotelService.findHotelUsers(id);
  }
}

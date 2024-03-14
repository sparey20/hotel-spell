import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('blah');
    return this.hotelService.findOne(id);
  }

  @Post()
  create(@Body() createHotelDTO) {
    // return this.hotelService.create(createHotelDTO);
  }
}

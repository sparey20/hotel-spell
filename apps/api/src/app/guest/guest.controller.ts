import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guests')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Get()
  findAll(
    @Query('hotel') hotelId: string,
    @Query('isActive') isActive: boolean
  ) {
    return this.guestService.findAll({
      hotelId: hotelId ?? null,
      isActive: isActive ?? false,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guests')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }
}

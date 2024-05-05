import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  findAll(@Query('hotel') hotelId: string) {
    return this.roomService.findAll(hotelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }
}

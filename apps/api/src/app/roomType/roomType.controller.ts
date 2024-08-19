import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RoomTypeService } from './roomType.service';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Controller('roomTypes')
export class RoomTypeController {
  constructor(private roomTypeService: RoomTypeService) {}

  @Get()
  findAll(@Query('hotel') hotelId: string) {
    return this.roomTypeService.findAll(hotelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomTypeDto: UpdateRoomTypeDto) {
    return this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Post()
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomTypeService.delete(id);
  }
}

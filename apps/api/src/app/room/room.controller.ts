import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { UpdateRoomDto } from './dto/update-room.dto';
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomService.delete(id);
  }
}

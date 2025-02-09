import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
  findAll(
    @Query('hotel') hotelId: string,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sortDirection', new DefaultValuePipe('')) sortDirection,
    @Query('sortColumn', new DefaultValuePipe(null)) sortColumn
  ) {
    return this.roomService.findAll({
      hotelId,
      search,
      page,
      limit,
      sortDirection,
      sortColumn,
    });
  }

  @Get('availableRooms')
  findAvailableRooms(
    @Query('hotel') hotelId: string,
    @Query('startDate') startDate: string,
    @Query('startDate') endDate: string,
    @Query('roomTypeId') roomTypeId: string,
  ) {
    return this.roomService.findAvailableRooms(hotelId, startDate, endDate, roomTypeId);
  }

  @Get('occupancy')
  getOccupancy(
    @Query('hotel') hotelId: string,
    @Query('date') date: string,
  ) {
    return this.roomService.getOccupancy(hotelId, date);
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

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
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Controller('amenities')
export class AmenityController {
  constructor(private amenityService: AmenityService) {}

  @Get()
  findAll() {
    return this.amenityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.amenityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenityService.update(id, updateAmenityDto);
  }

  @Post()
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenityService.create(createAmenityDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.amenityService.delete(id);
  }
}

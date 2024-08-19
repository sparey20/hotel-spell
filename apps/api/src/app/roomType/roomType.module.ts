import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './roomType.entity';
import { RoomTypeService } from './roomType.service';
import { RoomTypeController } from './roomType.controller';
import { Hotel } from '../hotel/hotel.entity';
import { HotelModule } from '../hotel/hotel.module';
import { AmenityModule } from '../amenities/amenity.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType]), HotelModule, AmenityModule],
  providers: [RoomTypeService],
  controllers: [RoomTypeController],
  exports: [RoomTypeService],
})
export class RoomTypeModule {}

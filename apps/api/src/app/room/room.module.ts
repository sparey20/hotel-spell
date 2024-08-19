import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { HotelModule } from '../hotel/hotel.module';
import { RoomTypeModule } from '../roomType/roomType.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), HotelModule, RoomTypeModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}

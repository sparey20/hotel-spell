import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelModule } from './hotel/hotel.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { GuestModule } from './guest/guest.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoomTypeModule } from './roomType/roomType.module';
import { AmenityModule } from './amenities/amenity.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      port: parseInt(process.env.POSTGRES_PORT as string),
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    HotelModule,
    UserModule,
    RoomModule,
    GuestModule,
    ReservationModule,
    RoomTypeModule,
    AmenityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

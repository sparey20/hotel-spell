import { Module } from '@nestjs/common';
import { PopulateDataCommand } from './populate-data.command';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [PopulateDataCommand],
})
export class AppModule {}

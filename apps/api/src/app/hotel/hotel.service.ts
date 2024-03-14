import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async findOne(id: string): Promise<any> {
    const hotel = await this.hotelRepository.findOneBy({ id });
    return 'asdfadsfasdf!';
  }

  async findHotelUsers(id: string) {
    console.log('here');
    return this.hotelRepository.findOneBy({ id });
  }

  async doSomething() {
    return 'asdfasdfdsf';
  }
}

import { HotelService } from './../hotel/hotel.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from './roomType.entity';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { Hotel } from '../hotel/hotel.entity';
import { AmenityService } from '../amenities/amenity.service';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    private readonly hotelService: HotelService,
    private readonly amenityService: AmenityService
  ) {}

  async findOne(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: {
        amenities: true,
      },
    });

    if (!roomType) {
      throw new NotFoundException();
    }

    return roomType;
  }

  async findAll(hotelId: string): Promise<RoomType[]> {
    return this.roomTypeRepository.find({
      where: {
        hotel: {
          id: hotelId,
        },
      },
      relations: {
        amenities: true
      },
    });
  }

  async create({
    hotelId,
    name,
    rate,
    maxGuests,
    squareFootage,
    bedConfiguration,
  }: CreateRoomTypeDto): Promise<RoomType> {
    const hotel = await this.hotelService.findOne(hotelId);

    if (!hotel) {
      throw new NotFoundException();
    }

    const roomType = new RoomType();
    roomType.name = name;
    roomType.rate = rate;
    roomType.maxGuests = maxGuests;
    roomType.squareFootage = squareFootage;
    roomType.bedConfiguration = bedConfiguration;
    roomType.hotel = hotel;

    return this.roomTypeRepository.save(roomType);
  }

  async update(
    roomTypeId: string,
    updateRoomTypeDto: UpdateRoomTypeDto
  ): Promise<RoomType> {
    const {
      name,
      rate,
      maxGuests,
      squareFootage,
      bedConfiguration,
      amenityIds,
    } = updateRoomTypeDto;

    const [roomType, updatedAmenities] = await Promise.all([
      this.findOne(roomTypeId),
      Promise.all(
        amenityIds.map((id) =>
          this.amenityService.findOne(id).catch(() => null)
        )
      ),
    ]);

    const updatedFields = {
      ...(name !== null && name !== undefined && { name }),
      ...(rate !== null && rate !== undefined && { rate }),
      ...(maxGuests !== null && maxGuests !== undefined && { maxGuests }),
      ...(squareFootage !== null &&
        squareFootage !== undefined && { squareFootage }),
      ...(bedConfiguration !== null &&
        bedConfiguration !== undefined && { bedConfiguration }),
      ...(updatedAmenities !== null &&
        updatedAmenities !== undefined && { amenities: updatedAmenities }),
    };

    Object.assign(roomType, updatedFields);

    await this.roomTypeRepository.save(roomType);

    return roomType;
  }

  async delete(roomTypeId: string): Promise<void> {
    await this.roomTypeRepository.delete(roomTypeId);
  }
}

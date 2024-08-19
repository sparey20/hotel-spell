import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>
  ) {}

  async findOne(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findOneBy({ id });

    if (!amenity) {
      throw new NotFoundException();
    }

    return amenity;
  }

  async findAll(): Promise<Amenity[]> {
    return this.amenityRepository.find();
  }

  async create({ name, category }: CreateAmenityDto): Promise<Amenity> {
    const amenity = new Amenity();
    amenity.name = name;
    amenity.category = category;

    return this.amenityRepository.save(amenity);
  }

  async update(
    amenityId: string,
    { name, category }: UpdateAmenityDto
  ): Promise<Amenity> {
    const amenity = await this.findOne(amenityId);

    if (!amenity) {
      throw new NotFoundException();
    }

    amenity.name = name;
    amenity.category = category;

    this.amenityRepository.update(amenityId, amenity);

    return amenity;
  }

  async delete(amenityId: string): Promise<void> {
    await this.amenityRepository.delete(amenityId);
  }
}

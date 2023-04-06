import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera) private cameraRepo: Repository<Camera>,
  ) {}

  async getList() {
    return await this.cameraRepo.find({ where: { deleted: false } });
  }

  async getById(cameraID: number) {
    return await this.cameraRepo.findOne({
      where: { id: cameraID, deleted: false },
    });
  }
}

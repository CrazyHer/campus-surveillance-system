import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera) private cameraRepo: Repository<Camera>,
  ) {}

  async getList(withAlarmRules = false): Promise<Camera[]> {
    return await this.cameraRepo.find({
      relations: { alarmRules: withAlarmRules },
    });
  }

  async getById(
    cameraID: number,
    withAlarmRules = false,
  ): Promise<Camera | null> {
    return await this.cameraRepo.findOne({
      where: { id: cameraID },
      relations: { alarmRules: withAlarmRules },
    });
  }

  async addCamera(camera: Partial<Camera>) {
    return await this.cameraRepo.save(camera);
  }

  async updateCamera(camera: Partial<Camera>) {
    if (!camera.id) return;
    await this.cameraRepo.save(camera);
  }

  async deleteCamera(cameraID: number) {
    await this.cameraRepo.softDelete({ id: cameraID });
  }
}

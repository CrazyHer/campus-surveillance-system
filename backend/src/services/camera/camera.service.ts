import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camera } from './camera.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera) private cameraRepo: Repository<Camera>,
    private configService: ConfigService,
  ) {}

  async getList(
    withAlarmRules = false,
    withAlarmEvents = false,
  ): Promise<Camera[]> {
    return await this.cameraRepo.find({
      relations: { alarmRules: withAlarmRules, alarmEvents: withAlarmEvents },
    });
  }

  async getOfflineList(): Promise<Camera[]> {
    return await this.cameraRepo.find({
      where: { online: false },
    });
  }

  async getById(
    cameraID: number,
    withAlarmRules = false,
    withAlarmEvents = false,
  ): Promise<Camera | null> {
    return await this.cameraRepo.findOne({
      where: { id: cameraID },
      relations: {
        alarmRules: withAlarmRules,
        alarmEvents: withAlarmEvents ? { alarmRule: true } : false,
      },
    });
  }

  getCameraStatus(camera: Camera): 'normal' | 'offline' | 'alarm' {
    if (camera.online === false) return 'offline';
    if (
      camera.alarmEvents?.filter((event) => event.resolved === false)?.length ??
      0 > 0
    )
      return 'alarm';
    return 'normal';
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

  getHlsUrl(cameraID: number): string {
    return '/hls/' + cameraID + '.m3u8';
  }
}

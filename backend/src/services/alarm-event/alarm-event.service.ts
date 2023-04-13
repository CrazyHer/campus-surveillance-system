import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmEvent } from './alarm-event.entity';
import { Repository } from 'typeorm';
import { CameraService } from '../camera/camera.service';

@Injectable()
export class AlarmEventService {
  constructor(
    @InjectRepository(AlarmEvent)
    private alarmEventRepo: Repository<AlarmEvent>,
    private cameraService: CameraService,
  ) {}

  async getList(
    withSourceCamera = false,
    withAlarmRule = false,
  ): Promise<AlarmEvent[]> {
    return await this.alarmEventRepo.find({
      relations: {
        sourceCamera: withSourceCamera,
        alarmRule: withAlarmRule,
      },
      order: { id: 'DESC' },
    });
  }

  async getByCameraId(
    cameraId: number,
    withSourceCamera = false,
    withAlarmRule = false,
  ) {
    return await this.alarmEventRepo.find({
      where: { sourceCamera: { id: cameraId } },
      relations: {
        sourceCamera: withSourceCamera,
        alarmRule: withAlarmRule,
      },
      order: { id: 'DESC' },
    });
  }

  async getResolvedList() {
    return await this.alarmEventRepo.find({ where: { resolved: true } });
  }

  async getPenddingList() {
    return await this.alarmEventRepo.find({ where: { resolved: false } });
  }

  async getPendingCount() {
    return await this.alarmEventRepo.count({ where: { resolved: false } });
  }

  async resolve(id: number) {
    await this.alarmEventRepo.update({ id }, { resolved: true });
  }

  async addEvent(event: Partial<AlarmEvent>) {
    return await this.alarmEventRepo.insert(event);
  }
}

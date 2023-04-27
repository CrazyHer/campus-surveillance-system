import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmEvent } from './alarm-event.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';

@Injectable()
export class AlarmEventService {
  constructor(
    @InjectRepository(AlarmEvent)
    private alarmEventRepo: Repository<AlarmEvent>,
  ) {}

  async getList(
    withSourceCamera = false,
    withAlarmRule = false,
    current?: number,
    pageSize?: number,
    search?: {
      resolved?: boolean;
      cameraName?: string;
      alarmRuleName?: string;
      cameraID?: number;
    },
  ): Promise<{ total: number; list: AlarmEvent[] }> {
    const findOptions: FindManyOptions<AlarmEvent> = {
      relations: {
        sourceCamera: withSourceCamera,
        alarmRule: withAlarmRule,
      },
      skip: current && pageSize ? (current - 1) * pageSize : undefined,
      take: current && pageSize ? pageSize : undefined,
      where: {
        resolved: search?.resolved,
        sourceCamera: {
          name: search?.cameraName ? Like(`%${search.cameraName}%`) : undefined,
          id: search?.cameraID,
        },
        alarmRule: {
          name: search?.alarmRuleName
            ? Like(`%${search.alarmRuleName}%`)
            : undefined,
        },
      },
    };

    const total = await this.alarmEventRepo.count(findOptions);
    const list = await this.alarmEventRepo.find({
      ...findOptions,
      order: {
        id: 'DESC',
      },
    });

    return { total, list };
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
    return await this.alarmEventRepo.save(event);
  }
}

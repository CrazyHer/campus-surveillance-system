import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlarmEvent } from './alarm-event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmEventService {
  constructor(
    @InjectRepository(AlarmEvent)
    private alarmEventRepo: Repository<AlarmEvent>,
  ) {}

  async getList() {
    return await this.alarmEventRepo.find();
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
    return await this.alarmEventRepo.update({ id }, { resolved: true });
  }
}

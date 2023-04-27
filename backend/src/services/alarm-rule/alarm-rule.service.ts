import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlarmRule } from './alarm-rule.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlarmRuleService {
  constructor(
    @InjectRepository(AlarmRule) private alarmRuleRepo: Repository<AlarmRule>,
  ) {}

  async getList(
    withRelatedCameras = false,
    withAlarmEvents = false,
  ): Promise<AlarmRule[]> {
    return await this.alarmRuleRepo.find({
      relations: {
        relatedCameras: withRelatedCameras,
        alarmEvents: withAlarmEvents,
      },
    });
  }

  async getById(
    ruleID: number,
    withRelatedCameras = false,
    withAlarmEvents = false,
  ): Promise<AlarmRule | null> {
    return await this.alarmRuleRepo.findOne({
      where: { id: ruleID },
      relations: {
        relatedCameras: withRelatedCameras,
        alarmEvents: withAlarmEvents,
      },
    });
  }

  async addRule(rule: Partial<AlarmRule>) {
    return await this.alarmRuleRepo.save(rule);
  }

  async updateRule(rule: Partial<AlarmRule>) {
    if (!rule.id) return;
    await this.alarmRuleRepo.save(rule);
  }

  async deleteRule(ruleID: number) {
    await this.alarmRuleRepo.softDelete({ id: ruleID });
  }
}

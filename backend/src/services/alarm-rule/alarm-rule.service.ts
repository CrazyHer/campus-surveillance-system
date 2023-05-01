import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlarmRule } from './alarm-rule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AiEndGateway } from 'src/ws-gateways/ai-end/ai-end.gateway';

@Injectable()
export class AlarmRuleService {
  constructor(
    @InjectRepository(AlarmRule) private alarmRuleRepo: Repository<AlarmRule>,
    @Inject(forwardRef(() => AiEndGateway))
    private aiEndGateway: AiEndGateway,
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
    const savedRule = await this.alarmRuleRepo.save(rule);

    await Promise.all(
      savedRule.relatedCameras?.map((camera) =>
        this.aiEndGateway.notifyCameraConfigChange(camera.id),
      ) ?? [],
    );
  }

  async updateRule(rule: Partial<AlarmRule>) {
    if (!rule.id) return;
    const originalRule = await this.getById(rule.id, true);
    const savedRule = await this.alarmRuleRepo.save(rule);

    const relatedCameraIds = [
      ...new Set(
        [
          ...(originalRule?.relatedCameras ?? []),
          ...(savedRule?.relatedCameras ?? []),
        ].map((camera) => camera.id),
      ),
    ];

    await Promise.all(
      relatedCameraIds.map((cameraId) =>
        this.aiEndGateway.notifyCameraConfigChange(cameraId),
      ),
    );
  }

  async deleteRule(ruleID: number) {
    const rule = await this.getById(ruleID, true);
    if (!rule) return;
    await this.alarmRuleRepo.softDelete({ id: ruleID });

    await Promise.all(
      rule.relatedCameras?.map((camera) =>
        this.aiEndGateway.notifyCameraConfigChange(camera.id),
      ) ?? [],
    );
  }
}

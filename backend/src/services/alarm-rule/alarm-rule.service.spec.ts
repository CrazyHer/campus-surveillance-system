import { Test, TestingModule } from '@nestjs/testing';
import { AlarmRuleService } from './alarm-rule.service';

describe('AlarmRuleService', () => {
  let service: AlarmRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmRuleService],
    }).compile();

    service = module.get<AlarmRuleService>(AlarmRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

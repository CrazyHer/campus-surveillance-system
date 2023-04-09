import { Test, TestingModule } from '@nestjs/testing';
import { AlarmEventService } from './alarm-event.service';

describe('AlarmEventService', () => {
  let service: AlarmEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmEventService],
    }).compile();

    service = module.get<AlarmEventService>(AlarmEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

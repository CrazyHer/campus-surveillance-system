import { Test, TestingModule } from '@nestjs/testing';
import { AiEndGateway } from './ai-end.gateway';

describe('AiEndGateway', () => {
  let gateway: AiEndGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiEndGateway],
    }).compile();

    gateway = module.get<AiEndGateway>(AiEndGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

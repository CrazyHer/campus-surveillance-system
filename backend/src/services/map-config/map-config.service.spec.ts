import { Test, TestingModule } from '@nestjs/testing';
import { MapConfigService } from './map-config.service';

describe('MapConfigService', () => {
  let service: MapConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapConfigService],
    }).compile();

    service = module.get<MapConfigService>(MapConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

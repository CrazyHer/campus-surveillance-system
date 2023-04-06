import { Test, TestingModule } from '@nestjs/testing';
import { CameraService } from './camera.service';

describe('CameraService', () => {
  let service: CameraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CameraService],
    }).compile();

    service = module.get<CameraService>(CameraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

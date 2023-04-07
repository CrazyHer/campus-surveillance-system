import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MapConfig } from './map-config.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MapConfigService {
  constructor(
    @InjectRepository(MapConfig) private mapConfigRepo: Repository<MapConfig>,
  ) {}

  async getLatestConfig(): Promise<MapConfig | null> {
    return (
      await this.mapConfigRepo.find({
        order: { id: 'DESC' },
        take: 1,
      })
    )?.[0];
  }

  async updateConfig(config: Partial<MapConfig>) {
    await this.mapConfigRepo.save(config);
  }
}

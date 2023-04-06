import { FetchTypes } from 'src/types/fetchTypes';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MapConfig {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'json' })
  value: FetchTypes['GET /api/user/getMapConfig']['res']['data'];

  @Column()
  createdAt: Date;
}

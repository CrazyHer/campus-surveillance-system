import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MapConfig {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  layerType: 'imageOverlay' | 'tileLayer';

  @Column()
  layerUrlOrPath: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  imageLayerBounds?: [[number, number], [number, number]];

  @Column({ type: 'json' })
  mapCenter: [number, number];

  @Column({ type: 'int' })
  mapZoom: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

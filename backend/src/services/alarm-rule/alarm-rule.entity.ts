import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Camera } from '../camera/camera.entity';
import { AlarmEvent } from '../alarm-event/alarm-event.entity';

@Entity()
export class AlarmRule {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  enabled: boolean;

  @Column()
  algorithmType: 'body' | 'vehicle';

  @Column({ type: 'json' })
  triggerDayOfWeek: number[];

  @Column()
  triggerTimeStart: string;

  @Column()
  triggerTimeEnd: string;

  @Column({ type: 'int' })
  triggerCountMin: number;

  @Column({ type: 'int' })
  triggerCountMax: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Camera, (camera) => camera.alarmRules)
  @JoinTable()
  relatedCameras?: Camera[];

  @OneToMany(() => AlarmEvent, (alarmEvent) => alarmEvent.alarmRule)
  alarmEvents?: AlarmEvent[];
}

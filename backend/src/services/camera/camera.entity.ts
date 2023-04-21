import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlarmEvent } from '../alarm-event/alarm-event.entity';
import { AlarmRule } from '../alarm-rule/alarm-rule.entity';

@Entity()
export class Camera {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bool', default: false })
  online: boolean;

  @Column({ default: '' })
  rtspUrl: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column()
  model: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => AlarmEvent, (alarmEvent) => alarmEvent.sourceCamera)
  @JoinColumn()
  alarmEvents?: AlarmEvent[];

  @ManyToMany(() => AlarmRule, (alarmRule) => alarmRule.relatedCameras)
  alarmRules?: AlarmRule[];
}

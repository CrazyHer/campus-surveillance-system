import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Camera } from '../camera/camera.entity';
import { AlarmRule } from '../alarm-rule/alarm-rule.entity';

@Entity()
export class AlarmEvent {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'bool', default: false })
  resolved: boolean;

  @Column()
  picFilePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Camera, (camera) => camera.alarmEvents)
  sourceCamera?: Camera;

  @ManyToOne(() => AlarmRule, (alarmRule) => alarmRule.alarmEvents)
  @JoinColumn()
  alarmRule?: AlarmRule;
}

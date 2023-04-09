import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Camera } from '../camera/camera.entity';
import { AlarmRule } from '../alarm-rule/alarm-rule.entity';

@Entity()
export class AlarmEvent {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  time: Date;

  @Column({ type: 'bool', default: false })
  resolved: boolean;

  @Column()
  picUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Camera, (camera) => camera.alarmEvents)
  sourceCamera: Camera;

  @ManyToOne(() => AlarmRule, (alarmRule) => alarmRule.alarmEvents)
  @JoinColumn()
  alarmRule: AlarmRule;
}

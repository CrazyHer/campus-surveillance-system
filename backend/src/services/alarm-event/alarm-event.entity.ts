import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => Camera, (camera) => camera.alarmEvents)
  sourceCamera: Camera;

  @ManyToOne(() => AlarmRule, (alarmRule) => alarmRule.alarmEvents)
  @JoinColumn()
  alarmRule: AlarmRule;
}

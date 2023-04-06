import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AlarmEvent } from '../alarm-event/alarm-event.entity';
import { AlarmRule } from '../alarm-rule/alarm-rule.entity';

@Entity()
export class Camera {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  hlsUrl: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column({ nullable: true })
  model: string;

  @Column({ type: 'bool', default: false })
  deleted: boolean;

  @OneToMany(() => AlarmEvent, (alarmEvent) => alarmEvent.sourceCamera)
  @JoinColumn()
  alarmEvents: AlarmEvent[];

  @ManyToMany(() => AlarmRule, (alarmRule) => alarmRule.relatedCameras)
  alarmRules: AlarmRule[];
}

import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
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
  enbaled: boolean;

  @Column()
  algorithmType: string;

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

  @ManyToMany(() => Camera, (camera) => camera.alarmRules)
  relatedCameras: Camera[];

  @OneToMany(() => AlarmEvent, (alarmEvent) => alarmEvent.alarmRule)
  alarmEvents: AlarmEvent[];
}

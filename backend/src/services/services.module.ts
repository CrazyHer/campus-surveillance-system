import { Module, Provider } from '@nestjs/common';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Camera } from './camera/camera.entity';
import { AlarmEvent } from './alarm-event/alarm-event.entity';
import { AlarmRule } from './alarm-rule/alarm-rule.entity';
import { CameraService } from './camera/camera.service';
import { AlarmEventService } from './alarm-event/alarm-event.service';
import { AlarmRuleService } from './alarm-rule/alarm-rule.service';

const entities: EntityClassOrSchema[] = [User, Camera, AlarmEvent, AlarmRule];

const services: Provider[] = [
  UserService,
  CameraService,
  AlarmEventService,
  AlarmRuleService,
];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: services,
  exports: services,
})
export class ServicesModule {}

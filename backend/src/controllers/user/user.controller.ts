import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  PreconditionFailedException,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { UserInfo } from 'src/decorators/userinfo/userinfo.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RoleGuard } from 'src/guards/role/role.guard';
import { AlarmEventService } from 'src/services/alarm-event/alarm-event.service';
import { CameraService } from 'src/services/camera/camera.service';
import { MapConfigService } from 'src/services/map-config/map-config.service';
import { User } from 'src/services/user/user.entity';
import { UserService } from 'src/services/user/user.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { FetchTypes } from 'src/types/fetchTypes';

@Controller()
@SetMetadata('role', 'user')
@UseGuards(AuthGuard, RoleGuard)
export class UserController {
  constructor(
    private cameraService: CameraService,
    private alarmEventService: AlarmEventService,
    private userService: UserService,
    private utilService: UtilsService,
    private mapConfigService: MapConfigService,
  ) {}

  @Get('/api/user/getCampusState')
  async getCampusState(): Promise<{
    cameraTotal: number;
    cameraOnline: number;
    cameraAlarm: number;
    alarmEventPending: number;
    cameraList: {
      cameraName: string;
      cameraID: number;
      cameraStatus: string;
      latlng: [number, number];
    }[];
  }> {
    const cameraList = await this.cameraService.getList();
    let cameraOnline = 0,
      cameraAlarm = 0;

    const cameraListRes = cameraList.map((camera) => {
      if (camera.status === 'online') cameraOnline++;
      if (camera.status === 'alarm') cameraAlarm++;
      return {
        cameraName: camera.name,
        cameraID: camera.id,
        cameraStatus: camera.status,
        latlng: [Number(camera.latitude), Number(camera.longitude)] as [
          number,
          number,
        ],
      };
    });

    return {
      cameraTotal: cameraList.length,
      cameraOnline,
      cameraAlarm,
      alarmEventPending: await this.alarmEventService.getPendingCount(),
      cameraList: cameraListRes,
    };
  }

  @Get('/api/user/getCameraInfo')
  async getCameraInfo(
    @Body('cameraID')
    cameraID: FetchTypes['GET /api/user/getCameraInfo']['req']['cameraID'],
  ): Promise<FetchTypes['GET /api/user/getCameraInfo']['res']['data']> {
    const camera = await this.cameraService.getById(cameraID);
    if (!camera) throw new NotFoundException('Camera not found');

    return {
      cameraName: camera.name,
      cameraID: camera.id,
      cameraStatus: camera.status,
      hlsUrl: camera.hlsUrl,
      latlng: [Number(camera.latitude), Number(camera.longitude)] as [
        number,
        number,
      ],
      cameraModel: camera.model,
      alarmRules: camera.alarmRules.map((rule) => ({
        alarmRuleID: rule.id,
        alarmRuleName: rule.name,
      })),
      alarmEvents: camera.alarmEvents.map((event) => ({
        eventID: event.id,
        alarmTime: dayjs(event.time).format('yyyy-MM-dd HH:mm:ss'),
        alarmRule: {
          alarmRuleID: event.alarmRule.id,
          alarmRuleName: event.alarmRule.name,
        },
        resolved: event.resolved,
      })),
    };
  }

  @Get('/api/user/resolveAlarm')
  async resolveAlarm(
    @Body('eventID')
    eventID: FetchTypes['POST /api/user/resolveAlarm']['req']['eventID'],
  ): Promise<FetchTypes['POST /api/user/resolveAlarm']['res']['data']> {
    await this.alarmEventService.resolve(eventID);
    return {};
  }

  @Get('/api/user/getAlarmEvents')
  async getAlarmEvents(
    @Body('cameraID')
    cameraID: FetchTypes['GET /api/user/getAlarmEvents']['req']['cameraID'],
  ): Promise<FetchTypes['GET /api/user/getAlarmEvents']['res']['data']> {
    if (cameraID) {
      const camera = await this.cameraService.getById(cameraID);
      if (!camera) throw new NotFoundException('Camera not found');
      return camera.alarmEvents.map((event) => ({
        eventID: event.id,
        alarmTime: dayjs(event.time).format('yyyy-MM-dd HH:mm:ss'),
        alarmRule: {
          alarmRuleID: event.alarmRule.id,
          alarmRuleName: event.alarmRule.name,
        },
        resolved: event.resolved,
        cameraID: camera.id,
        cameraName: camera.name,
        cameraLatlng: [Number(camera.latitude), Number(camera.longitude)],
        cameraModel: camera.model,
        alarmPicUrl: event.picUrl,
      }));
    } else {
      return (await this.alarmEventService.getList()).map((event) => ({
        eventID: event.id,
        alarmTime: dayjs(event.time).format('yyyy-MM-dd HH:mm:ss'),
        alarmRule: {
          alarmRuleID: event.alarmRule.id,
          alarmRuleName: event.alarmRule.name,
        },
        resolved: event.resolved,
        cameraID: event.sourceCamera.id,
        cameraName: event.sourceCamera.name,
        cameraLatlng: [
          Number(event.sourceCamera.latitude),
          Number(event.sourceCamera.longitude),
        ],
        cameraModel: event.sourceCamera.model,
        alarmPicUrl: event.picUrl,
      }));
    }
  }

  @Get('/api/user/getMonitList')
  async getMonitList(): Promise<
    FetchTypes['GET /api/user/getMonitList']['res']['data']
  > {
    return (await this.cameraService.getList()).map((camera) => ({
      cameraID: camera.id,
      cameraName: camera.name,
      cameraStatus: camera.status,
      hlsUrl: camera.hlsUrl,
    }));
  }

  @Get('/api/user/getUserInfo')
  async getUserInfo(
    @UserInfo('username') username: string,
  ): Promise<FetchTypes['GET /api/user/getUserInfo']['res']['data']> {
    const userInfo = await this.userService.getByUsername(username);
    if (!userInfo) throw new NotFoundException('User not found');
    return {
      username: userInfo.username,
      nickname: userInfo.nickname,
      email: userInfo.email ?? '',
      tel: userInfo.tel ?? '',
      role: userInfo.role,
      avatarURL: userInfo.avatarFilePath
        ? this.utilService.filePathToURL(userInfo.avatarFilePath)
        : '',
    };
  }

  @Post('/api/user/updateUserInfo')
  async updateUserInfo(
    @Body() body: FetchTypes['POST /api/user/updateUserInfo']['req'],
    @UserInfo('username') username: string,
  ): Promise<FetchTypes['POST /api/user/updateUserInfo']['res']['data']> {
    if (username !== body.username || (body as any).password) {
      throw new ForbiddenException('Permission denied');
    }

    if (body.avatarURL.startsWith('data:image')) {
      const avatarFilePath = await this.utilService.writeBase64ImageToFile(
        body.avatarURL,
      );
      await this.userService.updateUser({
        username: username,
        nickname: body.nickname,
        email: body.email,
        tel: body.tel,
        avatarFilePath,
      });
    } else {
      await this.userService.updateUser({
        username: username,
        nickname: body.nickname,
        email: body.email,
        tel: body.tel,
      });
    }

    return {};
  }

  @Post('/api/user/updatePassword')
  async updatePassword(
    @Body() body: FetchTypes['POST /api/user/updatePassword']['req'],
    @UserInfo('username') username: string,
  ): Promise<FetchTypes['POST /api/user/updatePassword']['res']['data']> {
    const user = await this.userService.getByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    if (body.oldPassword !== user.password) {
      throw new PreconditionFailedException('旧密码不正确');
    }

    await this.userService.updateUser({
      username: username,
      password: body.newPassword,
    });

    return {};
  }

  @Get('/api/user/getMapConfig')
  async getMapConfig(): Promise<
    FetchTypes['GET /api/user/getMapConfig']['res']['data']
  > {
    const config = await this.mapConfigService.getLatestConfig();
    if (!config) throw new NotFoundException('Map config not found');

    return config.value;
  }
}

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RoleGuard } from 'src/guards/role/role.guard';
import { AlarmRule } from 'src/services/alarm-rule/alarm-rule.entity';
import { AlarmRuleService } from 'src/services/alarm-rule/alarm-rule.service';
import { Camera } from 'src/services/camera/camera.entity';
import { CameraService } from 'src/services/camera/camera.service';
import { MapConfigService } from 'src/services/map-config/map-config.service';
import { UserService } from 'src/services/user/user.service';
import { UtilsService } from 'src/services/utils/utils.service';
import { FetchTypes } from 'src/types/fetchTypes';
import { AiEndGateway } from 'src/ws-gateways/ai-end/ai-end.gateway';

@Controller()
@SetMetadata('role', 'admin')
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
  constructor(
    private mapConfigService: MapConfigService,
    private utilsService: UtilsService,
    private cameraService: CameraService,
    private alarmRuleService: AlarmRuleService,
    private userService: UserService,
    private aiEndGateway: AiEndGateway,
  ) {}

  @Post('/api/admin/updateMapConfig')
  async updateMapConfig(
    @Body() body: FetchTypes['POST /api/admin/updateMapConfig']['req'],
  ): Promise<FetchTypes['POST /api/admin/updateMapConfig']['res']['data']> {
    if (
      body.layer.type === 'imageOverlay' &&
      body.layer.url.startsWith('data:image')
    ) {
      const filePath = await this.utilsService.writeBase64ImageToFile(
        body.layer.url,
      );
      this.mapConfigService.updateConfig({
        layerType: 'imageOverlay',
        layerUrlOrPath: filePath,
        imageLayerBounds: body.layer.bounds,
        mapCenter: body.mapOptions.center,
        mapZoom: body.mapOptions.zoom,
      });
    } else {
      await this.mapConfigService.updateConfig({
        layerType: 'tileLayer',
        layerUrlOrPath: body.layer.url,
        mapCenter: body.mapOptions.center,
        mapZoom: body.mapOptions.zoom,
      });
    }

    return {};
  }

  @Get('/api/admin/getCameraList')
  async getCameraList(): Promise<
    FetchTypes['GET /api/admin/getCameraList']['res']['data']
  > {
    const list = await this.cameraService.getList(true, true);
    return list.map((camera) => ({
      cameraID: camera.id,
      cameraName: camera.name,
      cameraStatus: this.cameraService.getCameraStatus(camera),
      latlng: [Number(camera.latitude), Number(camera.longitude)],
      cameraModel: camera.model,
      hlsUrl: this.cameraService.getHlsUrl(camera.id),
      rtspUrl: camera.rtspUrl,
      alarmRules:
        camera.alarmRules?.map((rule) => ({
          alarmRuleID: rule.id,
          alarmRuleName: rule.name,
        })) || [],
    }));
  }

  @Post('/api/admin/addCamera')
  async addCamera(
    @Body() body: FetchTypes['POST /api/admin/addCamera']['req'],
  ): Promise<FetchTypes['POST /api/admin/addCamera']['res']['data']> {
    await this.cameraService.addCamera({
      name: body.cameraName,
      model: body.cameraModel,
      latitude: body.latlng[0],
      longitude: body.latlng[1],
      rtspUrl: body.rtspUrl,
      alarmRules:
        body.alarmRuleIDs?.map((id) => {
          const rule = new AlarmRule();
          rule.id = id;
          return rule;
        }) || [],
    });

    return {};
  }

  @Post('/api/admin/updateCamera')
  async updateCamera(
    @Body() body: FetchTypes['POST /api/admin/updateCamera']['req'],
  ): Promise<FetchTypes['POST /api/admin/updateCamera']['res']['data']> {
    await this.cameraService.updateCamera({
      id: body.cameraID,
      name: body.cameraName,
      model: body.cameraModel,
      latitude: body.latlng[0],
      longitude: body.latlng[1],
      rtspUrl: body.rtspUrl,
      alarmRules: body.alarmRuleIDs.map((id) => {
        const rule = new AlarmRule();
        rule.id = id;
        return rule;
      }),
    });

    this.aiEndGateway.notifyCameraConfigChange(body.cameraID);
    return {};
  }

  @Post('/api/admin/deleteCamera')
  async deleteCamera(
    @Body() body: FetchTypes['POST /api/admin/deleteCamera']['req'],
  ): Promise<FetchTypes['POST /api/admin/deleteCamera']['res']['data']> {
    await this.cameraService.deleteCamera(body.cameraID);
    await this.aiEndGateway.disconnectClient(body.cameraID);
    return {};
  }

  @Get('/api/admin/getAlarmRuleList')
  async getAlarmRuleList(): Promise<
    FetchTypes['GET /api/admin/getAlarmRuleList']['res']['data']
  > {
    const list = await this.alarmRuleService.getList(true);

    return list.map((rule) => ({
      alarmRuleID: rule.id,
      alarmRuleName: rule.name,
      enabled: rule.enabled,
      algorithmType: rule.algorithmType,
      relatedCameras:
        rule.relatedCameras?.map((camera) => ({
          cameraID: camera.id,
          cameraName: camera.name,
        })) || [],
      triggerCondition: {
        time: {
          dayOfWeek: rule.triggerDayOfWeek,
          timeRange: [rule.triggerTimeStart, rule.triggerTimeEnd],
        },
        count: {
          min: rule.triggerCountMin,
          max: rule.triggerCountMax,
        },
      },
    }));
  }

  @Post('/api/admin/addAlarmRule')
  async addAlarmRule(
    @Body() body: FetchTypes['POST /api/admin/addAlarmRule']['req'],
  ): Promise<FetchTypes['POST /api/admin/addAlarmRule']['res']['data']> {
    await this.alarmRuleService.addRule({
      name: body.alarmRuleName,
      enabled: body.enabled,
      algorithmType: body.algorithmType,
      relatedCameras: body.relatedCameraIds.map((id) => {
        const camera = new Camera();
        camera.id = id;
        this.aiEndGateway.notifyCameraConfigChange(id);
        return camera;
      }),
      triggerDayOfWeek: body.triggerCondition.time.dayOfWeek,
      triggerTimeStart: body.triggerCondition.time.timeRange[0],
      triggerTimeEnd: body.triggerCondition.time.timeRange[1],
      triggerCountMin: body.triggerCondition.count.min,
      triggerCountMax: body.triggerCondition.count.max,
    });

    return {};
  }

  @Post('/api/admin/updateAlarmRule')
  async updateAlarmRule(
    @Body() body: FetchTypes['POST /api/admin/updateAlarmRule']['req'],
  ): Promise<FetchTypes['POST /api/admin/updateAlarmRule']['res']['data']> {
    await this.alarmRuleService.updateRule({
      id: body.alarmRuleID,
      name: body.alarmRuleName,
      enabled: body.enabled,
      algorithmType: body.algorithmType,
      relatedCameras: body.relatedCameraIds.map((id) => {
        const camera = new Camera();
        camera.id = id;
        this.aiEndGateway.notifyCameraConfigChange(id);
        return camera;
      }),
      triggerDayOfWeek: body.triggerCondition.time.dayOfWeek,
      triggerTimeStart: body.triggerCondition.time.timeRange[0],
      triggerTimeEnd: body.triggerCondition.time.timeRange[1],
      triggerCountMin: body.triggerCondition.count.min,
      triggerCountMax: body.triggerCondition.count.max,
    });

    return {};
  }

  @Post('/api/admin/deleteAlarmRule')
  async deleteAlarmRule(
    @Body() body: FetchTypes['POST /api/admin/deleteAlarmRule']['req'],
  ): Promise<FetchTypes['POST /api/admin/deleteAlarmRule']['res']['data']> {
    const rule = await this.alarmRuleService.getById(body.alarmRuleID, true);
    if (!rule) throw new NotFoundException('Alarm rule not found');

    rule?.relatedCameras?.forEach((camera) => {
      this.aiEndGateway.notifyCameraConfigChange(camera.id);
    });
    await this.alarmRuleService.deleteRule(body.alarmRuleID);

    return {};
  }

  @Get('/api/admin/getUserList')
  async getUserList(): Promise<
    FetchTypes['GET /api/admin/getUserList']['res']['data']
  > {
    const list = await this.userService.getUserList();
    return list.map((user) => ({
      username: user.username,
      avatarURL: user.avatarFilePath
        ? this.utilsService.filePathToURL(user.avatarFilePath)
        : '',
      email: user.email ?? '',
      tel: user.tel ?? '',
      nickname: user.nickname,
      role: user.role,
    }));
  }

  @Post('/api/admin/addUser')
  async addUser(
    @Body() body: FetchTypes['POST /api/admin/addUser']['req'],
  ): Promise<FetchTypes['POST /api/admin/addUser']['res']['data']> {
    await this.userService.addUser({
      username: body.username,
      password: body.password,
      role: body.role,
      nickname: body.nickname,
      email: body.email,
      tel: body.tel,
    });

    return {};
  }

  @Post('/api/admin/updateUser')
  async updateUser(
    @Body() body: FetchTypes['POST /api/admin/updateUser']['req'],
  ): Promise<FetchTypes['POST /api/admin/updateUser']['res']['data']> {
    await this.userService.updateUser({
      username: body.username,
      password: body.newPassword,
      role: body.role,
      nickname: body.nickname,
      email: body.email,
      tel: body.tel,
    });

    return {};
  }

  @Post('/api/admin/deleteUser')
  async deleteUser(
    @Body() body: FetchTypes['POST /api/admin/deleteUser']['req'],
  ): Promise<FetchTypes['POST /api/admin/deleteUser']['res']['data']> {
    await this.userService.deleteUser(body.username);

    return {};
  }
}

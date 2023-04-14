import {
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, ServerOptions, Socket } from 'socket.io';
import { AlarmEventService } from 'src/services/alarm-event/alarm-event.service';
import { AlarmRule } from 'src/services/alarm-rule/alarm-rule.entity';
import { Camera } from 'src/services/camera/camera.entity';
import { CameraService } from 'src/services/camera/camera.service';
import { UserService } from 'src/services/user/user.service';
import { UtilsService } from 'src/services/utils/utils.service';

interface ClientInfo {
  username: string;
  password: string;
  cameraID: string;
}

interface AlarmData {
  picBase64: string;
  alarmRuleID: number;
}

interface CameraConfig {
  rtmpUrl: string;
  alarmRules: AlarmRule[];
}

@WebSocketGateway<Partial<ServerOptions>>({
  path: '/ws/ai/',
  cors: {},
  serveClient: false,
})
export class AiEndGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wsServer: Server;
  constructor(
    private cameraService: CameraService,
    private alarmEventService: AlarmEventService,
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  connecetedClients: Map<string, Socket> = new Map();

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() body: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('message received: ', body);
    client.emit('message', 'hello from server');
  }

  @SubscribeMessage('alarm')
  async handleAlarm(
    @MessageBody() body: AlarmData,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('alarm received: ');

    const { cameraID } = client.data as ClientInfo;
    const sourceCamera = new Camera();
    sourceCamera.id = parseInt(cameraID);
    const alarmRule = new AlarmRule();
    alarmRule.id = body.alarmRuleID;

    await this.alarmEventService.addEvent({
      sourceCamera,
      picFilePath: await this.utilsService.writeBase64ImageToFile(
        body.picBase64,
      ),
      alarmRule,
    });
  }

  async notifyCameraConfigChange(
    cameraID: number,
    cameraConfig?: CameraConfig,
  ) {
    const client = this.connecetedClients.get(cameraID.toString());
    if (!cameraConfig) {
      const config = await this.cameraService.getById(cameraID, true);
      if (!config) return;
      cameraConfig = {
        alarmRules: config?.alarmRules ?? [],
        rtmpUrl: config.rtmpUrl,
      };
    }
    client?.emit('cameraConfigChange', cameraConfig);

    console.log(`notify ${cameraID} CameraConfigChange`);
  }

  async disconnectClient(cameraID: number) {
    this.connecetedClients.get(cameraID.toString())?.disconnect();
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      if (typeof client.client.request.headers.data !== 'string') {
        client.disconnect();
        return;
      }
      const data: ClientInfo = JSON.parse(client.client.request.headers.data);

      const user = await this.userService.authLogin(
        data.username,
        data.password,
      );

      if (user?.role !== 'admin') {
        client.disconnect();
        return;
      }

      if (this.connecetedClients.has(data.cameraID)) {
        this.connecetedClients.get(data.cameraID)?.disconnect();
        this.connecetedClients.delete(data.cameraID);
      }

      client.data = data;

      const camera = await this.cameraService.getById(
        parseInt(data.cameraID),
        false,
        true,
      );
      if (!camera) {
        client.disconnect();
        return;
      }

      await this.cameraService.updateCamera({
        id: parseInt(data.cameraID),
        online: true,
      });

      this.connecetedClients.set(data.cameraID, client);

      console.log(`client ${data.cameraID} connected`);

      await this.notifyCameraConfigChange(parseInt(data.cameraID));
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connecetedClients.delete(client.data.cameraID);
    client.removeAllListeners();

    const data = client.data as ClientInfo;
    await this.cameraService.updateCamera({
      id: parseInt(data.cameraID),
      online: false,
    });

    console.log(`client ${data.cameraID} disconnected`);
  }
}

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
import { CameraService } from 'src/services/camera/camera.service';
import { UserService } from 'src/services/user/user.service';

interface ClientInfo {
  username: string;
  password: string;
  cameraID: string;
  hlsUrl: string;
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
      this.connecetedClients.set(data.cameraID, client);

      await this.cameraService.updateCamera({
        id: parseInt(data.cameraID),
        hlsUrl: data.hlsUrl,
        status: 'normal',
      });

      console.log('client connected', data);
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connecetedClients.delete(client.data.cameraID);

    const data = client.data as ClientInfo;
    await this.cameraService.updateCamera({
      id: parseInt(data.cameraID),
      hlsUrl: '',
      status: 'offline',
    });

    console.log('client disconnected', client.data);
  }
}

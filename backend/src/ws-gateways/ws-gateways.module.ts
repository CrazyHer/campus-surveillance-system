import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/services/services.module';
import { AiEndGateway } from './ai-end/ai-end.gateway';

@Module({
  imports: [ServicesModule],
  providers: [AiEndGateway],
})
export class WsGatewaysModule {}

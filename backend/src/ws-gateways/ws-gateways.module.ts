import { Global, Module } from '@nestjs/common';
import { ServicesModule } from 'src/services/services.module';
import { AiEndGateway } from './ai-end/ai-end.gateway';

@Global()
@Module({
  imports: [ServicesModule],
  providers: [AiEndGateway],
  exports: [AiEndGateway],
})
export class WsGatewaysModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { CommonController } from './common/common.controller';
import { AdminController } from './admin/admin.controller';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionTransformerFilter } from 'src/interceptors/exception-transformer/exception-transformer.filter';
import { ResponseTransformerInterceptor } from 'src/interceptors/response-transformer/response-transformer.interceptor';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [ServicesModule],
  controllers: [UserController, CommonController, AdminController],
  providers: [
    { provide: APP_FILTER, useClass: ExceptionTransformerFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformerInterceptor },
  ],
})
export class ControllersModule {}

import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';

import { UserService } from 'src/services/user/user.service';
import { FetchTypes } from 'src/types/fetchTypes';

@Controller()
export class CommonController {
  constructor(private readonly userService: UserService) {}

  @Post('/api/user/login')
  async userLogin(
    @Body() data: FetchTypes['POST /api/user/login']['req'],
  ): Promise<FetchTypes['POST /api/user/login']['res']['data']> {
    const user = await this.userService.authLogin(data.username, data.password);

    if (user) {
      return {
        token: await this.userService.genToken(user),
        userInfo: {
          username: user.username,
          role: user.role,
          nickname: user.nickname,
          tel: user.tel ?? '',
          email: user.email ?? '',
          avatarURL: user.avatarURL,
        },
      };
    } else throw new ForbiddenException('用户名或密码错误');
  }
}

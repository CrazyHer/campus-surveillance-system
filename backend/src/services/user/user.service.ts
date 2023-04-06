import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';
import { base64ImageWriter } from 'src/utils/utils';
import { FetchTypes } from 'src/types/fetchTypes';

@Injectable()
export class UserService {
  publicDir = this.configService.getOrThrow<string>('PUBLIC_DIR_ABSOLUTE_PATH');

  URLToPublicDir = this.configService.getOrThrow<string>('URL_TO_PUBLIC_DIR');

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getUserList(): Promise<(User & { avatarURL: string })[]> {
    return (await this.userRepo.find({ select: { password: false } })).map(
      (user) => ({
        ...user,
        avatarURL:
          user.avatarFilePath?.replace(this.publicDir, this.URLToPublicDir) ??
          '',
      }),
    );
  }

  async authLogin(
    username: string,
    password: string,
  ): Promise<(User & { avatarURL: string }) | null> {
    const user = await this.userRepo.findOne({ where: { username, password } });
    if (!user) return null;
    return {
      ...user,
      avatarURL:
        user.avatarFilePath?.replace(this.publicDir, this.URLToPublicDir) ?? '',
    };
  }

  async genToken(user: User): Promise<string> {
    return 'Bearer ' + (await this.jwtService.signAsync({ ...user }));
  }

  async getByUsername(
    username: string,
  ): Promise<(User & { avatarURL: string }) | null> {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) return null;
    return {
      ...user,
      avatarURL:
        user.avatarFilePath?.replace(this.publicDir, this.URLToPublicDir) ?? '',
    };
  }

  async updateUser(user: Partial<User & { avatarURL: string }>) {
    if (!user.username) return;
    if (user.avatarURL?.startsWith('data:')) {
      const filePath = await base64ImageWriter(user.avatarURL, this.publicDir);
      delete user.avatarURL;
      await this.userRepo.update(
        { username: user.username },
        {
          ...user,
          avatarFilePath: filePath,
        },
      );
    } else {
      delete user.avatarURL;
      await this.userRepo.update({ username: user.username }, user);
    }
  }
}

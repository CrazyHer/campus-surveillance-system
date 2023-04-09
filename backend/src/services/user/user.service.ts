import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getUserList(): Promise<User[]> {
    return await this.userRepo.find({
      select: { password: false },
    });
  }

  async authLogin(username: string, password: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username, password } });
  }

  async genToken(user: User): Promise<string> {
    return 'Bearer ' + (await this.jwtService.signAsync({ ...user }));
  }

  async getByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async updateUser(user: Partial<User>) {
    if (!user.username) return;
    await this.userRepo.update({ username: user.username }, user);
  }

  async addUser(user: Partial<User>) {
    return await this.userRepo.insert(user);
  }

  async deleteUser(username: string) {
    await this.userRepo.softDelete({ username });
  }
}

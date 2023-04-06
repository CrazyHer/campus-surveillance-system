import { Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RoleGuard } from 'src/guards/role/role.guard';

@Controller()
@SetMetadata('role', 'admin')
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {}

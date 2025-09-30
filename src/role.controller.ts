import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import type { ApiResponse, Role } from './role.interface';

@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('role')
  getRoles(): ApiResponse<Role[]> {
    return this.roleService.getRoles();
  }
}

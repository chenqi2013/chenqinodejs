import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import type { ApiResponse, Role } from './role.interface';

@Controller('api/v1')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('role')
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return this.roleService.getRoles();
  }

  @Get('role/:id')
  async getRoleById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Role>> {
    return this.roleService.getRoleById(id);
  }

  @Post('role')
  async createRole(@Body() roleData: Omit<Role, 'id'>): Promise<ApiResponse<Role>> {
    return this.roleService.createRole(roleData);
  }

  @Put('role/:id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() roleData: Partial<Omit<Role, 'id'>>
  ): Promise<ApiResponse<Role>> {
    return this.roleService.updateRole(id, roleData);
  }

  @Delete('role/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.roleService.deleteRole(id);
  }
}

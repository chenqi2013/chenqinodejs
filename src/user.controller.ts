import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { UserService, type User, type CreateUserDto } from './user.service';
import type { ApiResponse } from './role.interface';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 创建或获取用户
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    return this.userService.findOrCreateUser(createUserDto.deviceId, createUserDto.nickname);
  }

  // 获取用户信息（通过设备ID）
  @Get(':deviceId')
  async getUserInfo(@Param('deviceId') deviceId: string): Promise<ApiResponse<User>> {
    return this.userService.getUserInfo(deviceId);
  }

  // 获取所有用户
  @Get()
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.userService.getAllUsers();
  }

  // 更新用户信息
  @Put(':deviceId')
  async updateUser(
    @Param('deviceId') deviceId: string,
    @Body() updateData: Partial<CreateUserDto>
  ): Promise<ApiResponse<User>> {
    return this.userService.updateUser(deviceId, updateData);
  }

  // 清空使用次数
  @Post(':deviceId/reset-usage')
  async resetUsageCount(@Param('deviceId') deviceId: string): Promise<ApiResponse<User>> {
    return this.userService.resetUsageCount(deviceId);
  }
}

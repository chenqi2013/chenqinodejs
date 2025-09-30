import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import type { ApiResponse } from './role.interface';

export interface User {
  id: number;
  deviceId: string;
  nickname: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  deviceId: string;
  nickname?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 创建或获取用户（通过设备ID）
  async findOrCreateUser(deviceId: string, nickname?: string): Promise<ApiResponse<User>> {
    let user = await this.userRepository.findOne({
      where: { deviceId, isActive: true }
    });

    if (!user) {
      user = this.userRepository.create({
        deviceId,
        nickname: nickname || `用户_${deviceId.slice(0, 8)}`,
        usageCount: 0,
        isActive: true
      });
      user = await this.userRepository.save(user);
    }

    return {
      code: 200,
      message: user ? "用户已存在" : "用户创建成功",
      data: this.mapToUser(user),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  // 通过设备ID查找用户
  async findByDeviceId(deviceId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { deviceId, isActive: true }
    });
  }

  // 通过ID查找用户
  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true }
    });
  }

  // 获取用户信息
  async getUserInfo(deviceId: string): Promise<ApiResponse<User>> {
    const user = await this.findByDeviceId(deviceId);
    
    if (!user) {
      throw new NotFoundException(`设备ID ${deviceId} 不存在`);
    }

    return {
      code: 200,
      message: "OK",
      data: this.mapToUser(user),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  // 增加使用次数
  async addUsageCount(userId: number, count: number): Promise<UserEntity> {
    const user = await this.findById(userId);
    
    if (!user) {
      throw new NotFoundException(`用户ID ${userId} 不存在`);
    }

    user.usageCount += count;
    return await this.userRepository.save(user);
  }

  // 更新用户信息
  async updateUser(deviceId: string, updateData: Partial<CreateUserDto>): Promise<ApiResponse<User>> {
    const user = await this.findByDeviceId(deviceId);
    
    if (!user) {
      throw new NotFoundException(`设备ID ${deviceId} 不存在`);
    }

    Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);

    return {
      code: 200,
      message: "用户信息更新成功",
      data: this.mapToUser(updatedUser),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  // 获取所有用户
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });

    return {
      code: 200,
      message: "OK",
      data: users.map(user => this.mapToUser(user)),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  // 清空使用次数
  async resetUsageCount(deviceId: string): Promise<ApiResponse<User>> {
    const user = await this.findByDeviceId(deviceId);
    
    if (!user) {
      throw new NotFoundException(`设备ID ${deviceId} 不存在`);
    }

    user.usageCount = 0;
    const updatedUser = await this.userRepository.save(user);

    return {
      code: 200,
      message: "使用次数已清空",
      data: this.mapToUser(updatedUser),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  // 映射实体到DTO
  private mapToUser(user: UserEntity): User {
    return {
      id: user.id,
      deviceId: user.deviceId,
      nickname: user.nickname,
      usageCount: user.usageCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

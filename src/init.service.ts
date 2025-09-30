import { Injectable, OnModuleInit } from '@nestjs/common';
import { RoleService } from './role.service';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(private readonly roleService: RoleService) {}

  async onModuleInit() {
    // 初始化角色数据
    await this.roleService.initializeRoles();
    console.log('✅ 数据库初始化完成');
  }
}

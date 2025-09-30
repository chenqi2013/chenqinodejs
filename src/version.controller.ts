import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { VersionService, type VersionCheckResult, type VersionInfo, type CreateVersionDto } from './version.service';
import type { ApiResponse } from './role.interface';

@Controller('api/v1/version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  /**
   * 检查版本更新
   * GET /api/v1/version/check?currentVersion=1.0.0&platform=android
   */
  @Get('check')
  async checkUpdate(
    @Query('currentVersion') currentVersion: string,
    @Query('platform') platform: string
  ): Promise<ApiResponse<VersionCheckResult>> {
    return this.versionService.checkUpdate(currentVersion, platform);
  }

  /**
   * 创建新版本
   * POST /api/v1/version
   */
  @Post()
  async createVersion(@Body() versionDto: CreateVersionDto): Promise<ApiResponse<VersionInfo>> {
    return this.versionService.createVersion(versionDto);
  }

  /**
   * 获取所有版本
   * GET /api/v1/version?platform=android
   */
  @Get()
  async getAllVersions(@Query('platform') platform?: string): Promise<ApiResponse<VersionInfo[]>> {
    return this.versionService.getAllVersions(platform);
  }

  /**
   * 获取指定平台的最新版本
   * GET /api/v1/version/latest/:platform
   */
  @Get('latest/:platform')
  async getLatestVersion(@Param('platform') platform: string): Promise<ApiResponse<VersionInfo>> {
    return this.versionService.getLatestVersion(platform);
  }

  /**
   * 更新版本信息
   * PUT /api/v1/version/:id
   */
  @Put(':id')
  async updateVersion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateVersionDto>
  ): Promise<ApiResponse<VersionInfo>> {
    return this.versionService.updateVersion(id, updateData);
  }

  /**
   * 删除版本
   * DELETE /api/v1/version/:id
   */
  @Delete(':id')
  async deleteVersion(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.versionService.deleteVersion(id);
  }
}

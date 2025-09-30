import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppVersionEntity } from './entities/app-version.entity';
import type { ApiResponse } from './role.interface';

export interface VersionInfo {
  id: number;
  version: string;
  platform: string;
  updateContent: string;
  downloadUrl: string;
  forceUpdate: boolean;
  versionCode: number;
  createdAt: Date;
}

export interface VersionCheckResult {
  hasUpdate: boolean;
  latestVersion: string;
  currentVersion: string;
  updateContent: string;
  downloadUrl: string;
  forceUpdate: boolean;
  versionCode: number;
}

export interface CreateVersionDto {
  version: string;
  platform: string;
  updateContent: string;
  downloadUrl: string;
  forceUpdate: boolean;
}

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(AppVersionEntity)
    private readonly versionRepository: Repository<AppVersionEntity>,
  ) {}

  /**
   * 检查版本更新
   * @param currentVersion 当前版本号，如 "1.0.0"
   * @param platform 平台：android 或 ios
   */
  async checkUpdate(currentVersion: string, platform: string): Promise<ApiResponse<VersionCheckResult>> {
    // 验证平台参数
    const normalizedPlatform = platform.toLowerCase();
    if (normalizedPlatform !== 'android' && normalizedPlatform !== 'ios') {
      throw new BadRequestException('平台参数错误，只支持 android 或 ios');
    }

    // 将版本号转换为数字用于比较
    const currentVersionCode = this.versionToCode(currentVersion);

    // 获取该平台的最新版本
    const latestVersion = await this.versionRepository.findOne({
      where: { 
        platform: normalizedPlatform,
        isActive: true 
      },
      order: { versionCode: 'DESC' }
    });

    if (!latestVersion) {
      // 没有找到版本信息
      return {
        code: 200,
        message: "暂无版本信息",
        data: {
          hasUpdate: false,
          latestVersion: currentVersion,
          currentVersion: currentVersion,
          updateContent: '',
          downloadUrl: '',
          forceUpdate: false,
          versionCode: currentVersionCode
        },
        timestamp: Math.floor(Date.now() / 1000)
      };
    }

    // 比较版本号
    const hasUpdate = latestVersion.versionCode > currentVersionCode;

    return {
      code: 200,
      message: hasUpdate ? "发现新版本" : "已是最新版本",
      data: {
        hasUpdate,
        latestVersion: latestVersion.version,
        currentVersion,
        updateContent: latestVersion.updateContent,
        downloadUrl: latestVersion.downloadUrl,
        forceUpdate: latestVersion.forceUpdate,
        versionCode: latestVersion.versionCode
      },
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 创建新版本
   */
  async createVersion(versionDto: CreateVersionDto): Promise<ApiResponse<VersionInfo>> {
    // 验证平台
    const normalizedPlatform = versionDto.platform.toLowerCase();
    if (normalizedPlatform !== 'android' && normalizedPlatform !== 'ios') {
      throw new BadRequestException('平台参数错误，只支持 android 或 ios');
    }

    // 检查版本是否已存在
    const existingVersion = await this.versionRepository.findOne({
      where: {
        version: versionDto.version,
        platform: normalizedPlatform
      }
    });

    if (existingVersion) {
      throw new BadRequestException(`版本 ${versionDto.version} (${normalizedPlatform}) 已存在`);
    }

    // 计算版本号
    const versionCode = this.versionToCode(versionDto.version);

    const newVersion = this.versionRepository.create({
      version: versionDto.version,
      platform: normalizedPlatform,
      updateContent: versionDto.updateContent,
      downloadUrl: versionDto.downloadUrl,
      forceUpdate: versionDto.forceUpdate,
      versionCode,
      isActive: true
    });

    const savedVersion = await this.versionRepository.save(newVersion);

    return {
      code: 201,
      message: "版本创建成功",
      data: this.mapToVersionInfo(savedVersion),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 获取所有版本
   */
  async getAllVersions(platform?: string): Promise<ApiResponse<VersionInfo[]>> {
    const where: any = { isActive: true };
    
    if (platform) {
      const normalizedPlatform = platform.toLowerCase();
      if (normalizedPlatform !== 'android' && normalizedPlatform !== 'ios') {
        throw new BadRequestException('平台参数错误，只支持 android 或 ios');
      }
      where.platform = normalizedPlatform;
    }

    const versions = await this.versionRepository.find({
      where,
      order: { versionCode: 'DESC', createdAt: 'DESC' }
    });

    return {
      code: 200,
      message: "OK",
      data: versions.map(v => this.mapToVersionInfo(v)),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 获取指定平台的最新版本
   */
  async getLatestVersion(platform: string): Promise<ApiResponse<VersionInfo>> {
    const normalizedPlatform = platform.toLowerCase();
    if (normalizedPlatform !== 'android' && normalizedPlatform !== 'ios') {
      throw new BadRequestException('平台参数错误，只支持 android 或 ios');
    }

    const latestVersion = await this.versionRepository.findOne({
      where: { 
        platform: normalizedPlatform,
        isActive: true 
      },
      order: { versionCode: 'DESC' }
    });

    if (!latestVersion) {
      throw new BadRequestException(`${platform} 平台暂无版本信息`);
    }

    return {
      code: 200,
      message: "OK",
      data: this.mapToVersionInfo(latestVersion),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 更新版本信息
   */
  async updateVersion(id: number, updateData: Partial<CreateVersionDto>): Promise<ApiResponse<VersionInfo>> {
    const version = await this.versionRepository.findOne({
      where: { id, isActive: true }
    });

    if (!version) {
      throw new BadRequestException(`版本 ID ${id} 不存在`);
    }

    // 如果更新了版本号，重新计算 versionCode
    if (updateData.version) {
      version.version = updateData.version;
      version.versionCode = this.versionToCode(updateData.version);
    }

    if (updateData.updateContent !== undefined) {
      version.updateContent = updateData.updateContent;
    }

    if (updateData.downloadUrl !== undefined) {
      version.downloadUrl = updateData.downloadUrl;
    }

    if (updateData.forceUpdate !== undefined) {
      version.forceUpdate = updateData.forceUpdate;
    }

    const updatedVersion = await this.versionRepository.save(version);

    return {
      code: 200,
      message: "版本更新成功",
      data: this.mapToVersionInfo(updatedVersion),
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 删除版本（软删除）
   */
  async deleteVersion(id: number): Promise<ApiResponse<null>> {
    const version = await this.versionRepository.findOne({
      where: { id, isActive: true }
    });

    if (!version) {
      throw new BadRequestException(`版本 ID ${id} 不存在`);
    }

    version.isActive = false;
    await this.versionRepository.save(version);

    return {
      code: 200,
      message: "版本删除成功",
      data: null,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 版本号转换为数字代码
   * 例如: "1.2.3" -> 10203
   * 支持格式: x.y.z
   */
  private versionToCode(version: string): number {
    try {
      const parts = version.split('.').map(p => parseInt(p, 10));
      
      if (parts.length !== 3 || parts.some(isNaN)) {
        throw new Error('版本号格式错误');
      }

      const [major, minor, patch] = parts;
      
      // 确保每部分不超过99
      if (major > 99 || minor > 99 || patch > 99) {
        throw new Error('版本号各部分不能超过99');
      }

      return major * 10000 + minor * 100 + patch;
    } catch (error) {
      throw new BadRequestException(`版本号格式错误: ${version}，正确格式为 x.y.z (如 1.0.0)`);
    }
  }

  /**
   * 映射实体到DTO
   */
  private mapToVersionInfo(version: AppVersionEntity): VersionInfo {
    return {
      id: version.id,
      version: version.version,
      platform: version.platform,
      updateContent: version.updateContent,
      downloadUrl: version.downloadUrl,
      forceUpdate: version.forceUpdate,
      versionCode: version.versionCode,
      createdAt: version.createdAt
    };
  }
}

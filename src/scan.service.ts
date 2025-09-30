import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScanRecordEntity } from './entities/scan-record.entity';
import { UserService } from './user.service';
import type { ApiResponse } from './role.interface';

export interface ScanResult {
  success: boolean;
  message: string;
  addedCount: number;
  scannerUsageCount: number;
  scannedUsageCount: number;
  scannerId: number;
  scannedId: number;
}

export interface ScanRecord {
  id: number;
  scannerId: number;
  scannedId: number;
  scannerNickname: string;
  scannedNickname: string;
  addedCount: number;
  createdAt: Date;
}

@Injectable()
export class ScanService {
  constructor(
    @InjectRepository(ScanRecordEntity)
    private readonly scanRecordRepository: Repository<ScanRecordEntity>,
    private readonly userService: UserService,
  ) {}

  /**
   * 扫码增加使用次数
   * @param scannerDeviceId 扫描者的设备ID
   * @param scannedDeviceId 被扫描者的设备ID（二维码内容）
   * @returns 扫码结果
   */
  async scanQRCode(scannerDeviceId: string, scannedDeviceId: string): Promise<ApiResponse<ScanResult>> {
    // 1. 验证：不能扫描自己
    if (scannerDeviceId === scannedDeviceId) {
      throw new BadRequestException('不能扫描自己的二维码');
    }

    // 2. 获取或创建扫描者和被扫描者
    const scannerResponse = await this.userService.findOrCreateUser(scannerDeviceId);
    const scannedResponse = await this.userService.findOrCreateUser(scannedDeviceId);

    const scanner = await this.userService.findByDeviceId(scannerDeviceId);
    const scanned = await this.userService.findByDeviceId(scannedDeviceId);

    if (!scanner || !scanned) {
      throw new NotFoundException('用户不存在');
    }

    // 3. 检查扫描限制
    // 规则：如果用户2给用户1扫过增加次数后，用户1用app扫描用户2的二维码后不增加使用次数
    
    // 检查扫描者是否已经扫描过被扫描者
    const scannerScannedBefore = await this.hasScannedBefore(scanner.id, scanned.id);
    if (scannerScannedBefore) {
      return {
        code: 200,
        message: "您已经扫描过该用户了，无法重复扫描",
        data: {
          success: false,
          message: "您已经扫描过该用户了，无法重复扫描",
          addedCount: 0,
          scannerUsageCount: scanner.usageCount,
          scannedUsageCount: scanned.usageCount,
          scannerId: scanner.id,
          scannedId: scanned.id
        },
        timestamp: Math.floor(Date.now() / 1000)
      };
    }

    // 检查反向扫描记录（被扫描者是否已经扫描过扫描者）
    const reverseScanned = await this.hasScannedBefore(scanned.id, scanner.id);
    if (reverseScanned) {
      return {
        code: 200,
        message: "对方已经扫描过您了，您无法再扫描对方",
        data: {
          success: false,
          message: "对方已经扫描过您了，您无法再扫描对方",
          addedCount: 0,
          scannerUsageCount: scanner.usageCount,
          scannedUsageCount: scanned.usageCount,
          scannerId: scanner.id,
          scannedId: scanned.id
        },
        timestamp: Math.floor(Date.now() / 1000)
      };
    }

    // 4. 创建扫描记录
    const scanRecord = this.scanRecordRepository.create({
      scannerId: scanner.id,
      scannedId: scanned.id,
      addedCount: 10,
      scanType: 'qrcode'
    });
    await this.scanRecordRepository.save(scanRecord);

    // 5. 增加被扫描者的使用次数
    const updatedScanned = await this.userService.addUsageCount(scanned.id, 10);

    return {
      code: 200,
      message: `扫码成功！${scanned.nickname} 的使用次数增加了 10 次`,
      data: {
        success: true,
        message: `扫码成功！${scanned.nickname} 的使用次数增加了 10 次`,
        addedCount: 10,
        scannerUsageCount: scanner.usageCount,
        scannedUsageCount: updatedScanned.usageCount,
        scannerId: scanner.id,
        scannedId: scanned.id
      },
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 检查用户A是否扫描过用户B
   */
  async hasScannedBefore(scannerId: number, scannedId: number): Promise<boolean> {
    const count = await this.scanRecordRepository.count({
      where: {
        scannerId,
        scannedId
      }
    });
    return count > 0;
  }

  /**
   * 获取用户的扫描记录（作为扫描者）
   */
  async getScanHistory(deviceId: string): Promise<ApiResponse<ScanRecord[]>> {
    const user = await this.userService.findByDeviceId(deviceId);
    
    if (!user) {
      throw new NotFoundException(`设备ID ${deviceId} 不存在`);
    }

    const records = await this.scanRecordRepository.find({
      where: { scannerId: user.id },
      relations: ['scanner', 'scanned'],
      order: { createdAt: 'DESC' }
    });

    const data: ScanRecord[] = records.map(record => ({
      id: record.id,
      scannerId: record.scannerId,
      scannedId: record.scannedId,
      scannerNickname: record.scanner.nickname,
      scannedNickname: record.scanned.nickname,
      addedCount: record.addedCount,
      createdAt: record.createdAt
    }));

    return {
      code: 200,
      message: "OK",
      data,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 获取用户收到的扫描记录（作为被扫描者）
   */
  async getReceivedScans(deviceId: string): Promise<ApiResponse<ScanRecord[]>> {
    const user = await this.userService.findByDeviceId(deviceId);
    
    if (!user) {
      throw new NotFoundException(`设备ID ${deviceId} 不存在`);
    }

    const records = await this.scanRecordRepository.find({
      where: { scannedId: user.id },
      relations: ['scanner', 'scanned'],
      order: { createdAt: 'DESC' }
    });

    const data: ScanRecord[] = records.map(record => ({
      id: record.id,
      scannerId: record.scannerId,
      scannedId: record.scannedId,
      scannerNickname: record.scanner.nickname,
      scannedNickname: record.scanned.nickname,
      addedCount: record.addedCount,
      createdAt: record.createdAt
    }));

    return {
      code: 200,
      message: "OK",
      data,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * 检查两个用户之间的扫描关系
   */
  async checkMutualScanStatus(deviceId1: string, deviceId2: string): Promise<ApiResponse<any>> {
    const user1 = await this.userService.findByDeviceId(deviceId1);
    const user2 = await this.userService.findByDeviceId(deviceId2);

    if (!user1 || !user2) {
      throw new NotFoundException('用户不存在');
    }

    const user1ScannedUser2 = await this.hasScannedBefore(user1.id, user2.id);
    const user2ScannedUser1 = await this.hasScannedBefore(user2.id, user1.id);

    return {
      code: 200,
      message: "OK",
      data: {
        user1: {
          deviceId: user1.deviceId,
          nickname: user1.nickname,
          hasScannedUser2: user1ScannedUser2
        },
        user2: {
          deviceId: user2.deviceId,
          nickname: user2.nickname,
          hasScannedUser1: user2ScannedUser1
        },
        canScan: {
          user1CanScanUser2: !user1ScannedUser2 || !user2ScannedUser1,
          user2CanScanUser1: !user2ScannedUser1 || !user1ScannedUser2
        }
      },
      timestamp: Math.floor(Date.now() / 1000)
    };
  }
}

import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ScanService, type ScanResult, type ScanRecord } from './scan.service';
import type { ApiResponse } from './role.interface';

export interface ScanQRCodeDto {
  scannerDeviceId: string;  // 扫描者的设备ID
  scannedDeviceId: string;  // 被扫描者的设备ID（二维码内容）
}

@Controller('api/v1/scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  /**
   * 扫描二维码
   * POST /api/v1/scan/qrcode
   * Body: { scannerDeviceId, scannedDeviceId }
   */
  @Post('qrcode')
  async scanQRCode(@Body() scanDto: ScanQRCodeDto): Promise<ApiResponse<ScanResult>> {
    return this.scanService.scanQRCode(scanDto.scannerDeviceId, scanDto.scannedDeviceId);
  }

  /**
   * 获取用户的扫描历史（我扫描了谁）
   * GET /api/v1/scan/history/:deviceId
   */
  @Get('history/:deviceId')
  async getScanHistory(@Param('deviceId') deviceId: string): Promise<ApiResponse<ScanRecord[]>> {
    return this.scanService.getScanHistory(deviceId);
  }

  /**
   * 获取用户收到的扫描（谁扫描了我）
   * GET /api/v1/scan/received/:deviceId
   */
  @Get('received/:deviceId')
  async getReceivedScans(@Param('deviceId') deviceId: string): Promise<ApiResponse<ScanRecord[]>> {
    return this.scanService.getReceivedScans(deviceId);
  }

  /**
   * 检查两个用户之间的扫描关系
   * GET /api/v1/scan/check?deviceId1=xxx&deviceId2=yyy
   */
  @Get('check')
  async checkMutualScanStatus(
    @Query('deviceId1') deviceId1: string,
    @Query('deviceId2') deviceId2: string
  ): Promise<ApiResponse<any>> {
    return this.scanService.checkMutualScanStatus(deviceId1, deviceId2);
  }
}

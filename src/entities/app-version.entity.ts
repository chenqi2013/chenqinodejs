import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_versions')
export class AppVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '版本号，如 1.0.0' })
  version: string;

  @Column({ type: 'varchar', length: 20, comment: '平台: android 或 ios' })
  platform: string;

  @Column({ type: 'text', comment: '更新内容描述' })
  updateContent: string;

  @Column({ type: 'varchar', length: 500, comment: '下载URL' })
  downloadUrl: string;

  @Column({ type: 'boolean', default: false, comment: '是否强制更新' })
  forceUpdate: boolean;

  @Column({ type: 'int', default: 0, comment: '版本号（用于比较），如 1.0.0 = 10000' })
  versionCode: number;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}

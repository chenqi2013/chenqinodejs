import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ScanRecordEntity } from './scan-record.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, comment: '设备唯一编号/二维码ID' })
  deviceId: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: '用户昵称' })
  nickname: string;

  @Column({ type: 'int', default: 0, comment: '使用次数' })
  usageCount: number;

  @Column({ type: 'boolean', default: true, comment: '是否激活' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  // 关联：作为扫描者的记录
  @OneToMany(() => ScanRecordEntity, record => record.scanner)
  scannedRecords: ScanRecordEntity[];

  // 关联：作为被扫描者的记录
  @OneToMany(() => ScanRecordEntity, record => record.scanned)
  receivedScans: ScanRecordEntity[];
}

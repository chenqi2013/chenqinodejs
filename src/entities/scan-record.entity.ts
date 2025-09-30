import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('scan_records')
@Index(['scannerId', 'scannedId'], { unique: false }) // 索引提高查询性能
export class ScanRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '扫描者用户ID' })
  scannerId: number;

  @Column({ type: 'int', comment: '被扫描者用户ID' })
  scannedId: number;

  @Column({ type: 'int', default: 10, comment: '增加的次数' })
  addedCount: number;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: '扫描类型' })
  scanType: string;

  @CreateDateColumn({ comment: '扫描时间' })
  createdAt: Date;

  // 关联到扫描者
  @ManyToOne(() => UserEntity, user => user.scannedRecords)
  @JoinColumn({ name: 'scannerId' })
  scanner: UserEntity;

  // 关联到被扫描者
  @ManyToOne(() => UserEntity, user => user.receivedScans)
  @JoinColumn({ name: 'scannedId' })
  scanned: UserEntity;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { ScanRecordEntity } from './entities/scan-record.entity';
import { AppVersionEntity } from './entities/app-version.entity';
import { InitService } from './init.service';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RoleEntity, UserEntity, ScanRecordEntity, AppVersionEntity]),
  ],
  controllers: [AppController, RoleController, UserController, ScanController, VersionController],
  providers: [AppService, RoleService, UserService, ScanService, VersionService, InitService],
})
export class AppModule {}

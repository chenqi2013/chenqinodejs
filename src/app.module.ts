import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [],
  controllers: [AppController, RoleController],
  providers: [AppService, RoleService],
})
export class AppModule {}

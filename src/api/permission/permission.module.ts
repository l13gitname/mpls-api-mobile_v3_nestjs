import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:
      [`.env.stage.${process.env.STAGE}`]
  })],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    DbService,
    UtilityService
  ]
})
export class PermissionModule { }

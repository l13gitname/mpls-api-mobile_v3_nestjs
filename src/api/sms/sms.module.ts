import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [ConfigModule.forRoot(
    {
      envFilePath:
        [
          `.env.stage.${process.env.STAGE}`
        ]
    }
  )],
  controllers: [SmsController],
  providers: [
    SmsService,
    DbService,
    UtilityService
  ]
})
export class SmsModule { }

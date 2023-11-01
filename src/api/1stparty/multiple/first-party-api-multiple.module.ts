import { Module } from '@nestjs/common';
import { FirstPartyApiMultipleController } from './first-party-api-multiple.controller';
import { FirstPartyApiMultipleService } from './first-party-api-multiple.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath:
        [
          `.env.stage.${process.env.STAGE}`
        ]
    })
  ],
  controllers: [FirstPartyApiMultipleController],
  providers: [
    DbService,
    UtilityService,
    FirstPartyApiMultipleService
  ]
})
export class FirstPartyApiMultipleModule { }

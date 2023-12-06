import { Module } from '@nestjs/common';
import { EConsentController } from './e-consent.controller';
import { EConsentService } from './e-consent.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [ConfigModule.forRoot(
    {
      envFilePath:
        [`.env.stage.${process.env.STAGE}`]
    }
  )
  ],
  controllers: [EConsentController],
  providers: [
    EConsentService,
    DbService,
    UtilityService
  ]
})
export class EConsentModule { }

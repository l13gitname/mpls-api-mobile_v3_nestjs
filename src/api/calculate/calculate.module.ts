import { Module } from '@nestjs/common';
import { CalculateController } from './calculate.controller';
import { CalculateService } from './calculate.service';
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
  controllers: [CalculateController],
  providers: [
    CalculateService,
    DbService,
    UtilityService
  ]
})
export class CalculateModule { }

import { UtilityService } from 'src/utility/utility.service';
import { Module } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MasterdataController } from './masterdata.controller';
import { MasterdataService } from './masterdata.service';
import { ConfigModule } from '@nestjs/config';

@Module({

  imports: [ConfigModule.forRoot(
    {
      envFilePath:
        [`.env.stage.${process.env.STAGE}`]
    }
  )
  ],
  controllers: [MasterdataController],
  providers: [
    MasterdataService,
    DbService,
    UtilityService
  ]
})
export class MasterdataModule { }

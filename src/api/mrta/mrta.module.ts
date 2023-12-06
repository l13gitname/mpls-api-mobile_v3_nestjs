import { Module } from '@nestjs/common';
import { MrtaService } from './mrta.service';
import { MrtaController } from './mrta.controller';
import { ConfigModule } from '@nestjs/config/dist/config.module';
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
  controllers: [MrtaController],
  providers: [
    MrtaService,
    DbService,
    UtilityService
  ]
})
export class MrtaModule { }

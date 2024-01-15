import { Module } from '@nestjs/common';
import { ViewsignController } from './viewsign.controller';
import { ViewsignService } from './viewsign.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [ConfigModule.forRoot(
    {
      envFilePath: [`.env.stage.${process.env.STAGE}`]
    }
  )],
  controllers: [ViewsignController],
  providers: [
    ViewsignService,
    DbService,
    UtilityService
  ]
})
export class ViewsignModule { }

import { Module } from '@nestjs/common';
import { ImageHandleController } from './image-handle.controller';
import { ImageHandleService } from './image-handle.service';
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
  controllers: [ImageHandleController],
  providers: [
    ImageHandleService,
    DbService,
    UtilityService
  ]
})
export class ImageHandleModule { }

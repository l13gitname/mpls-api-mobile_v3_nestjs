import { Module } from '@nestjs/common';
import { DipchipController } from './dipchip.controller';
import { DipchipService } from './dipchip.service';
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
    controllers: [DipchipController],
    providers: [
        DipchipService,
        DbService,
        UtilityService
    ]
})
export class DipchipModule { }

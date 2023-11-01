import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { FirstPartyApiController } from './first-party-api.controller';
import { FirstPartyApiService } from './first-party-api.service';

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
    controllers: [FirstPartyApiController],
    providers: [
        DbService,
        UtilityService,
        FirstPartyApiService
    ]
})
export class FirstPartyApiModule {}

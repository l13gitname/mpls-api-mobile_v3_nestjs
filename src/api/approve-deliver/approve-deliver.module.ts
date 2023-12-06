import { Module } from '@nestjs/common';
import { ApproveDeliverController } from './approve-deliver.controller';
import { ApproveDeliverService } from './approve-deliver.service';
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
    controllers: [ApproveDeliverController],
    providers: [
        ApproveDeliverService,
        DbService,
        UtilityService
    ]
})
export class ApproveDeliverModule { }

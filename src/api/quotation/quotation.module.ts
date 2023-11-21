import { QuotationController } from './quotation.controller';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from './../../db/db.service';
import { QuotationService } from './quotation.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(
        {
            envFilePath:
                [`.env.stage.${process.env.STAGE}`]
        }
    )
    ],
    controllers: [QuotationController],
    providers: [
        QuotationService,
        DbService,
        UtilityService,
    ]
})
export class QuotationModule { }

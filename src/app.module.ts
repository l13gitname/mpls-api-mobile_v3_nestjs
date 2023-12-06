import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
/*... api Module import ...*/
import { UserModule } from './api/user/user.module';
import { MasterdataModule } from './api/masterdata/masterdata.module';
import { FirstPartyApiModule } from './api/1stparty/first-party-api.module';
import { DbService } from './db/db.service';
import { UtilityService } from './utility/utility.service';
import { QuotationModule } from './api/quotation/quotation.module';
import { QuotationService } from './api/quotation/quotation.service';
import { MulterModule } from '@nestjs/platform-express';
import { FirstPartyApiMultipleModule } from './api/1stparty/multiple/first-party-api-multiple.module';
import { SandboxModule } from './api/sandbox/sandbox.module';
import { SandboxService } from './api/sandbox/sandbox.service';
import { DipchipModule } from './api/dipchip/dipchip.module';
import { EConsentModule } from './api/e-consent/e-consent.module';
import { CalculateModule } from './api/calculate/calculate.module';
import { MrtaModule } from './api/mrta/mrta.module';
import { ApproveDeliverModule } from './api/approve-deliver/approve-deliver.module';
import { SmsModule } from './api/sms/sms.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Define your file upload destination
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`]
    }),
    UserModule,
    MasterdataModule,
    FirstPartyApiModule,
    FirstPartyApiMultipleModule,
    QuotationModule,
    DipchipModule,
    EConsentModule,
    ApproveDeliverModule,
    CalculateModule,
    MrtaModule,
    SmsModule,
    SandboxModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DbService,
    UtilityService,
    QuotationService,
    DipchipModule,
    EConsentModule,
    ApproveDeliverModule,
    CalculateModule,
    MrtaModule,
    SmsModule,
    SandboxService
  ],
})
export class AppModule { }

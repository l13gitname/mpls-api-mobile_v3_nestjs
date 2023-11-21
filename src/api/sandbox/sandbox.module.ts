import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from 'src/db/db.service';
import { Module } from '@nestjs/common';
import { SandboxController } from './sandbox.controller';
import { SandboxService } from './sandbox.service';
import { ConfigModule } from '@nestjs/config';

@Module({

    imports: [
        AuthModule,
        ConfigModule.forRoot(
            {
                envFilePath:
                    [`.env.stage.${process.env.STAGE}`]
            }
        )
    ],
    controllers: [SandboxController],
    providers: [SandboxService, DbService, UtilityService],
    exports: [SandboxService]
})
export class SandboxModule { }

import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from 'src/db/db.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
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
  controllers: [UserController],
  providers: [UserService,DbService,UtilityService,AuthService,JwtService],
  exports: [UserService]
})
export class UserModule {}

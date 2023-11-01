import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local-auth/local-auth.stategy';
import { JwtModule } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configservice: ConfigService) => {
        return {
          secret: configservice.get('JWT_SECRET'),
          signOptions: { expiresIn: '1 days' },
        }
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, DbService, UtilityService],
})
export class AuthModule {}

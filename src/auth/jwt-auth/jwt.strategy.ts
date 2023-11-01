import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IResUserToken) {
    return <IResUserToken>{
      admin_role: payload.admin_role, 
      email: payload.email, 
      expire_date: payload.expire_date, 
      first_name: payload.first_name, 
      iat: payload.iat, 
      ID: payload.ID, 
      last_name: payload.last_name, 
      status: payload.status,
      username: payload.username
    }
  }
}
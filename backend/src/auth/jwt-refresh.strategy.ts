import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: true
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username}
  }
}
import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, GoogleStrategy],
  imports: [UsersModule, HttpModule, PassportModule, JwtModule.registerAsync({
    useFactory: async () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_IN }
    })
  })],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }

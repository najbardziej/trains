import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { GoogleAuthService } from './google-auth.service';

@Module({
  providers: [AuthService, GoogleAuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
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

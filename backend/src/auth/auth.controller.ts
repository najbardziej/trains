import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from 'src/dto/user.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { TokenDto } from 'src/dto/refreshToken.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Body() token: TokenDto) {
    return this.authService.removeRefreshToken(token);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Body() token: TokenDto) {
    return this.authService.refreshJwtToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
}

import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserLoginDto } from 'src/dto/userLogin.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    console.log("login called");
    return this.authService.login(userLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  
}

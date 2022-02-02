import { Body, Controller, Get, Post, UseGuards, Request, Res, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from 'src/dto/user.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { TokenDto } from 'src/dto/token.dto';
import { GoogleTokenDto } from 'src/dto/googleToken.dto';
// import { GoogleAuthGuard } from './google-auth.guard';

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

  // @Post('loginViaToken')
  // async loginViaToken(@Body() token: TokenDto) {
  //   return this.authService.loginViaToken(token);
  // }

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
  async getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Body() token: GoogleTokenDto) {
    return this.authService.googleLogin(token);
  }

  // @UseGuards(GoogleAuthGuard)
  // @Get('google/redirect')
  // async googleAuthRedirect(@Request() req, @Res() res) {
  //   var token = await this.authService.googleLogin(req.user)

  //   return res.redirect('http://localhost:4200/auth/google/login/' + 
  //     token.accessToken + '/' +
  //     token.refreshToken);
  // }
}
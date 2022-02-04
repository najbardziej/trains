import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { TokenDto } from 'src/dto/token.dto';
import { GoogleAuthService } from './google-auth.service';
import { GoogleTokenDto } from 'src/dto/googleToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    let user = await this.usersService.findOne(usernameOrEmail);
    if (pass == "") {
      throw new UnauthorizedException("Use OAuth");
    }
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async register(userRegisterDto: UserRegisterDto): Promise<any> {
    try {
      const result = await this.usersService.create(userRegisterDto);
      const payload = { username: result.username }
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.generateRefreshToken(result.username)
      }
    }
    catch {
      throw new UnauthorizedException();
    }
  }

  async login(userDto: UserDto): Promise<any> {
    try {
      const user = await this.usersService.findOne(userDto.username);
      const payload = { username: user.username };
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.generateRefreshToken(user.username)
      }
    }
    catch {
      throw new UnauthorizedException();
    }
  }

  async loginViaToken(token: TokenDto): Promise<any> {
    try {
      const username = this.jwtService.decode(token.accessToken)['username'];
      const user = await this.usersService.findOne(username);

      if (!await bcrypt.compare(token.refreshToken, user.refreshToken)) {
        throw new UnauthorizedException();
      }
      const payload = { username: user.username }
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.generateRefreshToken(user.username)
      }
    }
    catch {
      throw new UnauthorizedException();
    }
  }

  async refreshJwtToken(token: TokenDto): Promise<any> {
    try {
      const username = this.jwtService.decode(token.accessToken)['username'];
      const user = await this.usersService.findOne(username);
      const payload = { username: user.username }
      return {
        accessToken: this.jwtService.sign(payload),
      }
    }
    catch {
      throw new UnauthorizedException();
    }
  }

  async removeRefreshToken(token: TokenDto): Promise<void> {
    if (!token.refreshToken)
      throw new UnauthorizedException();

    const username = this.jwtService.decode(token.accessToken)['username'];
    const user = await this.usersService.findOne(username);

    if (!user)
      throw new UnauthorizedException();

    this.usersService.setCurrentRefreshToken("", user.username);
    return;
  }

  async generateRefreshToken(username: string): Promise<any> {
    const payload = { username: username };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET
    });

    this.usersService.setCurrentRefreshToken(token, username);

    return token;
  }

  async googleLogin(token: GoogleTokenDto): Promise<any> {

    console.log("googleLogin called", token);
    let tokenInfo;
    try {
      tokenInfo = await this.googleAuthService.validateToken(token.authToken);
    }
    catch {
      throw new UnauthorizedException("Bad google auth token");
    }

    let user = await this.usersService.findOne(tokenInfo.email);

    if (user && user.password == '') {

      const payload = { username: user.username }
      
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.generateRefreshToken(user.username)
      }

    } else if (!user) {

      const newUser: UserRegisterDto = {
        username: tokenInfo.email,
        email: tokenInfo.email,
        password: "",
      }

      const result = await this.usersService.create(newUser);
      const payload = { username: result.username }

      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: await this.generateRefreshToken(user.username)
      }

    } else {
      throw new UnauthorizedException("Not OAuth user!");
    }
  }
}

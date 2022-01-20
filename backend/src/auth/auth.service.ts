import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { TokenDto } from 'src/dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
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
      const payload = {username: result.username}
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

  async googleLogin(request: any) : Promise<TokenDto>{

    let user = await this.usersService.findOne(request.email);

    if (user && user.password == '') {

      const payload = {username: user.username}
      user = await this.usersService.setCurrentRefreshToken(request.accessToken, user.username);
  
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: request.accessToken
      }

    } else if (!user) {

      const newUser : UserRegisterDto = {
        username: request.email,
        email: request.email,
        password: "",
      }
  
      const result = await this.usersService.create(newUser);
      const payload = {username: result.username}
      user = await this.usersService.setCurrentRefreshToken(request.accessToken, request.email);
  
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: request.accessToken
      }
      
    } else {
      throw new UnauthorizedException("Not OAuth user!");
    }
  }
}

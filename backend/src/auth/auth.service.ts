import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/dto/userLogin.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    let user = await this.usersService.findOne(usernameOrEmail);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async register(userRegisterDto: UserRegisterDto): Promise<any> {
    try {
      const result = await this.usersService.create(userRegisterDto);
      return {
        accessToken: this.jwtService.sign({username: result.username}),
      }
    } 
    catch {
      throw new UnauthorizedException();
    }
  }

  async login(userLoginDto: UserLoginDto): Promise<any> {
    const user = await (await this.usersService.findOne(userLoginDto.username));
    const payload = { username: user.username};
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}

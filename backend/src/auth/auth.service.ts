import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async register(userDto: UserDto): Promise<any> {
    try {
      const result = await this.usersService.create(userDto)
      return {
        accessToken: this.jwtService.sign({username: result.username}),
      }
    } 
    catch {
      throw new UnauthorizedException();
    }
  }

  async login(user: any): Promise<any> {
    const payload = { username: user.username};
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}

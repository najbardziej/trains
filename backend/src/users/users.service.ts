import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { TokenDto } from 'src/dto/refreshToken.dto';
import { UserRegisterDto } from 'src/dto/userRegister.dto';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findOne(usernameOrEmail: string): Promise<User | undefined> {
    let user = await this.userModel.findOne({ username: usernameOrEmail });
    if (!user){
      user = await this.userModel.findOne({ email: usernameOrEmail });
    }
    return user;
  }

  async create(userDto: UserRegisterDto): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    let hashedPassword;

    if (userDto.password != '')
      hashedPassword = await bcrypt.hash(userDto.password, salt);
    else
      hashedPassword = ''

    return (new this.userModel({
      username: userDto.username,
      email: userDto.email,
      password: hashedPassword
    })).save();
  }

  async setCurrentRefreshToken(token: string, username: string): Promise<any> {
    const user = await this.userModel.findOne({ username: username });
    if (token == "") {
      user.refreshToken = ""
    } else {
      const salt = await bcrypt.genSalt(10);
      user.refreshToken = await bcrypt.hash(token, salt);
    }
    return (new this.userModel(user)).save();
  }
}

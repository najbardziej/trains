import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsString() @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString() @IsNotEmpty()
  readonly password: string;
}

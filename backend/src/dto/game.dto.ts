import { IsString, IsOptional } from 'class-validator';

export class GameDto {
  @IsString()
  readonly roomName: string;

  @IsString() @IsOptional()
  readonly password: string;
}

import { IsString, IsOptional } from 'class-validator';

export class GameRoomDto {
  @IsString()
  readonly roomName: string;

  @IsString() @IsOptional()
  readonly password: string;
}

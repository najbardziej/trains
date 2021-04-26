import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GameDto {
  @IsNumber() @IsOptional()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString() @IsOptional()
  readonly password: string;
}

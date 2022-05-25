import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GameService } from '../game.service';
import { GameMapService } from './game-map.service';

@Controller('game-map')
@ApiTags('game-map')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GameMapController {

  constructor(
    private readonly gameService: GameService,
    private readonly gameMapService: GameMapService
  ) {}

  @Get(':gameId')
  get(@Param('gameId') gameId: string): any {
    return this.gameMapService.get(gameId);
  }
}

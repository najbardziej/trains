import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GameEntity } from 'src/entities/game.entity';
import { GameService } from './game.service';


@Controller('game')
@ApiTags('game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GameController {

  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req): Promise<GameEntity> {
    return this.gameService.getForUser(id, req.user.username);
  }
}

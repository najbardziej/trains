import { Body, Controller, ForbiddenException, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EventsGateway } from 'src/events/events.gateway';
import { Game } from 'src/schemas/game.schema';
import { GameService } from './game.service';


@Controller('game')
@ApiTags('game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GameController {

  constructor(
    private readonly gameService: GameService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req): Promise<Game> {
    return this.gameService.getGame(id, req.user.username);
  }

  @Get(':id/game-map')
  getGameMap(@Param('id') gameId: string): any {
    return this.gameService.getGameMap(gameId);
  }

  @Put('/:id/draw-card/:index')
  async drawCard(@Param('id') id: string, @Param('index') index: number, @Req() req) {
    await this.gameService.drawCard(id, req.user.username, index);

    const game = await this.gameService.getGame(id, req.user.username);
    this.eventsGateway.emitGame(game);
  }

  @Put('/:id/buy-route')
  async buyRoute(@Param('id') id: string, @Body() route, @Req() req) {
    await this.gameService.buyRoute(id, req.user.username, route);

    const game = await this.gameService.getGame(id, req.user.username);
    this.eventsGateway.emitGame(game);
    this.eventsGateway.emitGameMap(game);
  }
}

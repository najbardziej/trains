import { Body, Controller, ForbiddenException, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EventsGateway } from 'src/events/events.gateway';
import { Game } from 'src/schemas/game.schema';
import { GameMapService } from './game-map/game-map.service';
import { GameService } from './game.service';


@Controller('game')
@ApiTags('game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GameController {

  constructor(
    private readonly gameService: GameService,
    private readonly gameMapService: GameMapService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string, @Req() req): Promise<Game> {
    return this.gameService.getForUser(id, req.user.username);
  }

  @Put('/:id/get-card/:index')
  async getCard(@Param('id') id: string, @Param('index') index: number, @Req() req) {
    await this.gameService.drawCard(id, req.user.username, index);
    this.eventsGateway.emitGame(
      await this.gameService.getForUser(id, req.user.username)
    );
  }

  @Put('/:id/buy-route')
  async buyRoute(@Param('id') id: string, @Body() route, @Req() req) {
    const playerId = await this.gameService.getPlayerId(id, req.user.username);
    const player = await this.gameService.getPlayer(id, req.user.username);

    const savedRoute: any = await this.gameMapService.getRoute(id, route.id);

    if (savedRoute.owner) 
      throw new ForbiddenException();

    if (savedRoute.color !== route.color && savedRoute.color !== 9) 
      throw new ForbiddenException();

    if (player.cards[savedRoute.color] + player.cards[0] < savedRoute.length)
      throw new ForbiddenException();

    player.cards[route.color] -= savedRoute.length;
    if (player.cards[route.color] < 0) {
      player.cards[0] += player.cards[route.color];
      player.cards[route.color] = 0;
    }

    route.owner = playerId;

    await this.gameMapService.saveRoute(id, route);
    await this.gameService.savePlayer(id, req.user.username, player);

    this.eventsGateway.emitGame(
      await this.gameService.getForUser(id, req.user.username)
    );

    this.eventsGateway.emitGameMap(
      await this.gameMapService.get(id)
    );
  }
}

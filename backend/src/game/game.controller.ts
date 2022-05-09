import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    return this.gameService.getForUser(id, req.user.username);
  }

  @Put('/:id/get-card/:index')
  async getCard(@Param('id') id: string, @Param('index') index: number, @Req() req) {
    await this.gameService.drawCard(id, req.user.username, index);
    this.eventsGateway.emitGame(
      await this.gameService.getForUser(id, req.user.username)
    );
  }
}

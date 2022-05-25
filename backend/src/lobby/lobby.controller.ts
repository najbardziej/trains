import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GameRoomDto } from 'src/dto/game-room.dto';
import { EventsGateway } from 'src/events/events.gateway';
import { GameRoom } from 'src/schemas/game-room.schema';
import { GameService } from 'src/game/game.service';
import { GameMapService } from 'src/game/game-map/game-map.service';

@ApiTags('lobby')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lobby')
export class LobbyController {

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly gameService: GameService,
    private readonly gameMapService: GameMapService,
    private readonly eventsGateway: EventsGateway, 
    ) { }

  @Get()
  async index(): Promise<GameRoom[]> {
    return this.lobbyService.findAll();
  }

  @Post()
  async create(@Body() gameRoomDto: GameRoomDto, @Req() req): Promise<GameRoom> {
    const gameRoom = await this.lobbyService.create(gameRoomDto, req.user.username);
    await this.eventsGateway.emitLobby();
    return gameRoom;
  }

  @Put("/join/:id")
  async join(@Param('id') id: string, @Req() req) {
    await this.lobbyService.join(id, req.user.username);
    await this.eventsGateway.emitLobby();
  }

  @Put("/leave/:id")
  async leave(@Param('id') id: string, @Req() req) {
    await this.lobbyService.leave(id, req.user.username);
    await this.eventsGateway.emitLobby();
  }

  @Put("/start/:id")
  async start(@Param('id') id: string, @Req() req) {
    const gameRoom = await this.lobbyService.findOne(req.user.username);
    if (gameRoom.players[0] !== req.user.username) {
      throw new ForbiddenException()
    }
    if (gameRoom.players.length === 1) {
      throw new ForbiddenException()
    }
    let game = await this.gameService.create(gameRoom.players);
    await this.gameMapService.create(game.id);
    this.eventsGateway.emitGameStart(id, game.id);
    await this.lobbyService.delete(id, req.user.username);
    await this.eventsGateway.emitLobby();
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    await this.lobbyService.delete(id, req.user.username);
    await this.eventsGateway.emitLobby();
  }
}

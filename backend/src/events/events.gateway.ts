import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LobbyService } from 'src/lobby/lobby.service';
import { Injectable } from '@nestjs/common';
import { GameRoom } from 'src/schemas/game-room.schema';
import { Game } from 'src/schemas/game.schema';
import { FORCED_MOVE } from 'src/model/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})//TODO: secure it
@Injectable()
export class EventsGateway implements OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly lobbyService: LobbyService
  ) { }

  async handleDisconnect(client: any) {
    try { // Workaround for https://github.com/nestjs/cqrs/issues/409
      const gameRoom = await this.lobbyService.findOne(client.username);
      if (gameRoom) {
        await this.lobbyService.leave(gameRoom.id, client.username);
      }
      if (gameRoom.players.length == 1) {
        await this.lobbyService.delete(gameRoom.id, client.username);
      }
    }
    catch { return; }
    try { // Workaround for https://github.com/nestjs/cqrs/issues/409
      await this.emitLobby();
    }
    catch { return; }
  }

  async emitLobby() {
    const gameRooms = await this.lobbyService.findAll()
    this.server.emit("lobby", gameRooms);
  }

  emitGameStart(roomId: string, gameId: string) {
    this.server.emit(roomId, gameId);
  }

  emitGame(game: Game) {
    const {gameMap, missions, cardPile, discardPile, ...gameToEmit} = game;
    this.server.emit(`game-${game['id']}`, gameToEmit);
  }

  emitGameMap(game: Game) {
    this.server.emit(`gamemap-${game['id']}`, game.gameMap);
  }

  emitMessage(game: Game, message: string) {
    this.server.emit(`message-${game['id']}`, message);
  }

  emitEndTurnMessages(game: Game) {
    if (game.forcedMove != FORCED_MOVE.NONE)
      return;

    if (game.remainingTurns == game.players.length) {
      const player = game.players.find(player => player.trains <= 2);
      this.emitMessage(
        game, `${player.username} has only ${player.trains} left. Everyone has one more move till the game ends.`);
    }
    else if (game.remainingTurns > 0) {
      this.emitMessage(game, `${game.remainingTurns} turns left till the game ends.`);
    }
    else if (game.remainingTurns == 0) {
      this.emitMessage(game, `Game has concluded.`);
      return;
    }
    
    this.emitMessage(game, `${game.players[game.currentPlayer].username}'s turn started`)
  }

  @SubscribeMessage('identify')
  identify(@MessageBody() data: any, @ConnectedSocket() client: any) {
    /// TODO: secure by receiving accesstoken, verify it and extract username from payload 
    client.username = data.username;
  }
}
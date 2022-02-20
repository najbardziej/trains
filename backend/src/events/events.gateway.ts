import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameRoomEntity } from 'src/entities/game-room.entity';
import { LobbyService } from 'src/lobby/lobby.service';
import { Injectable } from '@nestjs/common';
import { GameEntity } from 'src/entities/game.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})//TODO: secure it
@Injectable()
export class EventsGateway implements  OnGatewayDisconnect { //OnModuleInit,

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly lobbyService: LobbyService
    ) { }

  async handleDisconnect(client: any) {
    const gameRoom = await this.lobbyService.findOne(client.username);
    if (gameRoom) {
      try { // Workaround for https://github.com/nestjs/cqrs/issues/409
        await this.lobbyService.leave(gameRoom.id, client.username);
      }
      catch{}
      if (gameRoom.players.length == 1) {
        try { // Workaround for https://github.com/nestjs/cqrs/issues/409
          await this.lobbyService.delete(gameRoom.id, client.username);
        }
        catch {}
      }

      this.emitLobby(await this.lobbyService.findAll());
    }
  }

  emitLobby(gameRoomEntities: GameRoomEntity[]) {
    this.server.emit("lobby", gameRoomEntities);
  }

  emitGameStart(roomId, gameId) {
    this.server.emit(roomId, gameId);
  }
  
  @SubscribeMessage('identify')
  findAll(@MessageBody() data: any, @ConnectedSocket() client: any) {
    /// TODO: secure by receiving accesstoken, verify it and extract username from payload 
    client.username = data.username;
  }
}
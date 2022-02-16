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
import { GameStateEntity } from 'src/entities/game-state.entity';

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
      await this.lobbyService.leave(gameRoom.id, client.username);
      if (gameRoom.players.length == 1) {
        await this.lobbyService.delete(gameRoom.id, client.username);
      }

      this.emitLobby(await this.lobbyService.findAll());
    }
  }

  emitLobby(gameRoomEntities: GameRoomEntity[]) {
    this.server.emit("lobby", gameRoomEntities);
  }

  emitGameState(gameState: GameStateEntity) {
    this.server.emit(gameState.id, gameState);
  }
  
  @SubscribeMessage('identify')
  findAll(@MessageBody() data: any, @ConnectedSocket() client: any) {
    /// TODO: secure by receiving accesstoken, verify it and extract username from payload 
    client.username = data.username;
  }
}
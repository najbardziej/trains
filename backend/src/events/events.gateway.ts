import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { GameRoomEntity } from 'src/entities/game-room.entity';
import { GamesService } from 'src/games/games.service';
import { Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
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
    private readonly gamesService: GamesService
    ) { }

  // async onModuleInit() {
  //   console.log("onModuleInit EventsGateway")
  // }

  async handleDisconnect(client: any) {
    const game = await this.gamesService.findOne(client.username);
    if (game) {
      await this.gamesService.leave(game.id, client.username);
      if (game.players.length == 1) {
        await this.gamesService.delete(game.id, client.username);
      }

      this.emitGameRooms(await this.gamesService.findAll());
    }
  }

  emitGameRooms(gameRoomEntities: GameRoomEntity[]) {
    this.server.emit("game-rooms", gameRoomEntities);
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
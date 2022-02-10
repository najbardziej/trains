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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})//TODO: secure it
export class EventsGateway implements OnGatewayDisconnect {
  private readonly gamesService

  @WebSocketServer()
  server: Server;

  constructor() { }

  handleDisconnect(client: any) {
    console.log("disconnected: ", client.username)
  }

  emitGameRooms(gameRoomEntities: GameRoomEntity[]) {
    this.server.emit("game-rooms", gameRoomEntities);
  }

  // emitGameState(gameId: string, gameState: GameStateEntity) {
  //   this.server.emit(gameId, gameState);
  // }

  
  @SubscribeMessage('identify')
  findAll(@MessageBody() data: any, @ConnectedSocket() client: any) {
    console.log("identify data:", data)
    client.username = data.username;
  }
}
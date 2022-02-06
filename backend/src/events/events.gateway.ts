import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { GameRoomEntity } from 'src/entities/game-room.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})//TODO: secure it
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  emitGameRooms(gameRoomEntities: GameRoomEntity[]) {
    this.server.emit("game-rooms", gameRoomEntities);
  }

  // emitGameState(gameId: string, gameState: GameStateEntity) {
  //   this.server.emit(gameId, gameState);
  // }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }
}
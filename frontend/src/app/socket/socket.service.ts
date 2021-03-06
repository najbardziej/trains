import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Game } from '../model/game';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  identify(username: string) {
    this.socket.emit("identify", { username })
  }

  getRoomObservable(gameRoomId: string): Observable<any> {
    return this.socket.fromEvent(gameRoomId);
  }

  getGameObservable(gameId: string): Observable<Game> {
    return this.socket.fromEvent(`game-${gameId}`);
  }

  getGameMapObservable(gameId: string): Observable<any> {
    return this.socket.fromEvent(`gamemap-${gameId}`);
  }

  getGameRoomsObservable(): Observable<any> {
    return this.socket.fromEvent("lobby");
  }

  getMessageObservable(gameId: string): Observable<any> {
    return this.socket.fromEvent(`message-${gameId}`);
  }
}

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  leaveAllRooms() {
    
  }

  identify(username: string) {
    this.socket.emit("identify", { username })
  }

  getRoomObservable(gameRoomId: string): Observable<any> {
    return this.socket.fromEvent(gameRoomId);
  }

  getGameRoomsObservable(): Observable<any> {
    return this.socket.fromEvent("lobby");
  }
}

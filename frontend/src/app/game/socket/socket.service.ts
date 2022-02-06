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
    let rooms = this.socket.ioSocket
  }

  getGameRoomsObservable(): Observable<any> {
    return this.socket.fromEvent("game-rooms").pipe(
      tap(data => console.log("All", JSON.stringify(data))),
    );
  }
}

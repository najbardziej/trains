import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GameRoom } from '../model/game-room';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  private lobbyUrl = `${environment.apiUrl}/lobby`;

  constructor(private http: HttpClient) { }

  getGameRooms(): Observable<GameRoom[]> {
    return this.http.get<GameRoom[]>(this.lobbyUrl).pipe(
      catchError(this.handleError)
    );
  }

  joinGameRoom(gameRoomId: string): Observable<any> {
    return this.http.put(`${this.lobbyUrl}/join/${gameRoomId}`, {})
  }

  leaveGameRoom(gameRoomId: string): Observable<any> {
    return this.http.put(`${this.lobbyUrl}/leave/${gameRoomId}`, {})
  }

  startGame(gameRoomId: string): Observable<any> {
    return this.http.put(`${this.lobbyUrl}/start/${gameRoomId}`, {})
  }

  createGameRoom(): Observable<any> {
    return this.http.post(this.lobbyUrl, { roomName: Math.random().toString(36).replace(/[^a-z]+/g, '') })
  }

  private handleError(err: HttpErrorResponse) {
    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = `An error occured: ${err.error.message}`;
    } else {
      message = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(message);
    return throwError(message);
  }
}

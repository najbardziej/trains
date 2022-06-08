import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameRoom } from '../model/game-room';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  private lobbyUrl = `${environment.apiUrl}/lobby`;

  constructor(private http: HttpClient) { }

  getGameRooms(): Observable<GameRoom[]> {
    return this.http.get<GameRoom[]>(this.lobbyUrl);
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
}

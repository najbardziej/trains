import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from '../model/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameUrl = `${environment.apiUrl}/game`;

  constructor(private http: HttpClient) { }

  getGameData(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.gameUrl}/${id}`);
  }
}

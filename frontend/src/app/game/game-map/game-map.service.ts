import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameMapService {
  
  private gameMapUrl = `${environment.apiUrl}/game-map`;
  
  constructor(private http: HttpClient) { }

  getGameMapData(id: string): Observable<any> {
    return this.http.get(`${this.gameMapUrl}/${id}`);
  }
}

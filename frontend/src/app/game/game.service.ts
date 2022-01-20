import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IGame } from './game';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesUrl = `${environment.apiUrl}/games`;

  constructor(private http: HttpClient) { }

  getGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.gamesUrl).pipe(
      tap(data => console.log("All", JSON.stringify(data))),
      catchError(this.handleError)
    );
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

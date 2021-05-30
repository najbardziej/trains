import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:7000/auth/'
  constructor(private httpClient: HttpClient) { }

  login(user: User) : Observable<any>{
    return this.httpClient.post(`${this.baseUrl}login`, user)
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  register(user: User) : Observable<any>{
    return this.httpClient.post(`${this.baseUrl}register`, user)
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }
}

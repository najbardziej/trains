import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { Token } from '../model/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:7000/auth/'
  constructor(private httpClient: HttpClient) { }

  login(user: User) : Observable<any> {
    return this.httpClient.post(`${this.baseUrl}login`, user);
  }

  register(user: User) : Observable<any> {
    return this.httpClient.post(`${this.baseUrl}register`, user);
  }

  loginViaToken(token: Token) {
    return this.httpClient.post(`${this.baseUrl}loginViaToken`, token);
  }

  refreshToken() {
    return this.httpClient.post(`${this.baseUrl}refresh`, {
      'accessToken': localStorage.getItem("accessToken"),
      'refreshToken': localStorage.getItem("refreshToken")
    }).pipe(tap((tokens: any) => {
      localStorage.setItem("accessToken", tokens.accessToken);
    }));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

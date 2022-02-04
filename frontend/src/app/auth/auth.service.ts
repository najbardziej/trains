import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { Token } from '../model/token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  constructor(private httpClient: HttpClient) { }

  login(user: User) : Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, user);
  }

  register(user: User) : Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/register`, user);
  }

  loginViaToken(token: Token) {
    return this.httpClient.post(`${this.baseUrl}/loginViaToken`, token);
  }

  refreshToken() {
    return this.httpClient.post(`${this.baseUrl}/refresh`, {
      'accessToken': localStorage.getItem("accessToken"),
      'refreshToken': localStorage.getItem("refreshToken")
    }).pipe(tap((tokens: any) => {
      localStorage.setItem("accessToken", tokens.accessToken);
    }));
  }

  googleLogin(authToken: string) : Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/google`, { authToken });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

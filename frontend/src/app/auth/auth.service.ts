import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';

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

  refreshToken() {
    return this.httpClient.post(`${this.baseUrl}refresh`, {
      'accessToken': localStorage.getItem("accessToken"),
      'refreshToken': localStorage.getItem("refreshToken")
    }).pipe(tap((tokens: any) => {
      localStorage.setItem("accessToken", tokens.accessToken);
    }));
  }
}

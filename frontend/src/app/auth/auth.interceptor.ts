import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request)
      .pipe(
        tap(event => {
          if (event.type === HttpEventType.Response) {
            if (event.body){
              if (event.body.accessToken) {
                localStorage.setItem('accessToken', event.body.accessToken);
              }
              if (event.body.refreshToken) {
                localStorage.setItem('refreshToken', event.body.refreshToken);
              }
            }
          }
        })
      )
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            return this.handle401Error(request, next);
          } else {
            return throwError(err);
          }
        })
      )
  }

  handle401Error(request: any, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
  
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }));
  
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token.accessToken));
        }));
    }
  }

  addToken(request: any, token: any): HttpRequest<any> {
    return request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token)
    });
  }
}
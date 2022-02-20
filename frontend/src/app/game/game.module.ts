import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';


@NgModule({
  declarations: [GameComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] }
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
export class GameModule { }

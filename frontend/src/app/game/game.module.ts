import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { GameResolver } from './game.resolver';
import { GameCardComponent } from './game-card/game-card.component';
import { PlayerCardComponent } from './player-card/player-card.component';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [GameComponent, GameCardComponent, PlayerCardComponent],
  imports: [
    CommonModule,
    AuthModule,
    RouterModule.forChild([
      {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard], resolve: {game: GameResolver} },
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
export class GameModule { }

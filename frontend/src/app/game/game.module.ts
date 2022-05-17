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
import { GameMapComponent } from './game-map/game-map.component';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { GameMapResolver } from './game-map/game-map.resolver';

@NgModule({
  declarations: [GameComponent, GameCardComponent, PlayerCardComponent, GameMapComponent, PlayerInfoComponent],
  imports: [
    CommonModule,
    AuthModule,
    RouterModule.forChild([
      {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard], resolve: {game: GameResolver, gameMap: GameMapResolver} },
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
export class GameModule { }

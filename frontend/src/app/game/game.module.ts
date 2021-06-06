import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list/games-list.component';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { MdbModule } from 'mdb-angular-ui-kit';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthGuard } from '../auth/auth-guard.service';



@NgModule({
  declarations: [
    GamesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdbModule,
    RouterModule.forChild([
      {path: 'games', component: GamesListComponent, canActivate: [AuthGuard] }
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
export class GameModule { }

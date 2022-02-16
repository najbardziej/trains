import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthGuard } from '../auth/auth-guard.service';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@NgModule({
  declarations: [
    LobbyComponent,
  ],
  imports: [
    MdbFormsModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'lobby', component: LobbyComponent, canActivate: [AuthGuard] }
    ])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ]
})
export class LobbyModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LobbyModule } from './lobby/lobby.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { GameModule } from './game/game.module';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    LobbyModule,
    GameModule,
    AuthModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot({ url: environment.apiUrl, options: {}}),
    ToastrModule.forRoot({
      timeOut: 4000,
    }),
    ToastContainerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { IconsModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GameModule } from './game/game.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IconsModule,
    RouterModule.forRoot([]),
    GameModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { IconsModule } from 'angular-bootstrap-md'

import { AppComponent } from './app.component';
import { GamesListComponent } from './games-list/games-list.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GamesListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IconsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

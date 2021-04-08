import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list/games-list.component';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';



@NgModule({
  declarations: [
    GamesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forChild([
      {path: 'games', component: GamesListComponent}
    ])

  ]
})
export class GameModule { }

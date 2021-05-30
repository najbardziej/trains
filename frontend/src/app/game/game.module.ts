import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesListComponent } from './games-list/games-list.component';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { MdbModule } from 'mdb-angular-ui-kit';



@NgModule({
  declarations: [
    GamesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdbModule,
    RouterModule.forChild([
      {path: 'games', component: GamesListComponent}
    ])

  ]
})
export class GameModule { }

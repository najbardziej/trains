import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IGame } from '../game';
import { GameService } from '../game.service';

@Component({
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 2000).subscribe(() => {
      this.gameService.getGames().subscribe(
        ((games: IGame[]) => this.games = games),
        (err) => console.log(err)
    )});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get filteredGames(): IGame[] {
    return this.games.filter((game: IGame) => 
      game.roomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      game.player1?.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) )
  }

  games : IGame[] = [];
  errorMessage: string = '';
  listFilter: string = '';
  subscription!: Subscription;
}

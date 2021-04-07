import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../game.service';
import { IGame } from './game';

@Component({
  selector: 'trains-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.subscription = this.gameService.getGames().subscribe({
      next: games => this.games = games,
      error: err => this.errorMessage = err 
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _listFilter: string = '';
  get listFilter(): string { return this._listFilter };
  set listFilter(value: string) { this._listFilter = value };

  get filteredGames(): IGame[] {
    return this.games.filter((game: IGame) => 
      game.RoomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      game.Player1.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) )
  }

  games : IGame[] = [];
  errorMessage: string = '';
  subscription!: Subscription;
}

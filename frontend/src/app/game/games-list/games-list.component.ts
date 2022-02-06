import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IGame } from '../game';
import { GameService } from '../game.service';
import { SocketService } from '../socket/socket.service';

@Component({
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {

  constructor(
    private readonly gameService: GameService,
    private readonly socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(
      ((games: IGame[]) => this.games = games),
      (err) => console.log(err)
    );

    this.socketService.getGameRoomsObservable().subscribe((games: IGame[]) => {
      console.log("getGameRoomsObservable success", games);
      this.games = games;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createGameRoom() {
    this.gameService.createGameRoom().subscribe((x => console.log(x)))
  }

  get filteredGames(): IGame[] {
    return this.games.filter((game: IGame) =>
      game.roomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      game.players[0].toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()))
  }

  games: IGame[] = [];
  errorMessage: string = '';
  listFilter: string = '';
  subscription!: Subscription;
}

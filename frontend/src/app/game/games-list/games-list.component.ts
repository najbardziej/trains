import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { IGame } from '../game';
import { GameService } from '../game.service';
import { SocketService } from '../socket/socket.service';

@Component({
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {

  games: IGame[] = [];
  listFilter: string = '';
  subscription!: Subscription;
  gameSubscription!: Subscription;

  constructor(
    private readonly router: Router,
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(
      ((games: IGame[]) => this.games = games),
      (err) => console.error(err)
    );

    this.socketService.identify(this.authService.getUsername());

    this.subscription = this.socketService.getGameRoomsObservable().subscribe((games: IGame[]) => {
      this.games = games;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.gameSubscription.unsubscribe();
  }

  private createGameObservable(id: string) {
    this.gameSubscription = this.socketService.getRoomObservable(id).subscribe((data: any) => {
      this.router.navigate([`/game/${data.id}`]);
    })
  }

  createGameRoom() {
    this.gameService.createGameRoom().subscribe((data: any) => {
      this.createGameObservable(data.id);
    });
  }

  joinGameRoom(gameId: string) {
    this.gameService.joinGameRoom(gameId).subscribe(() => {
      this.createGameObservable(gameId);
    });
  }

  leaveGameRoom(gameId: string) {
    this.gameService.leaveGameRoom(gameId).subscribe();
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  startGame(gameId: string) {
    this.gameService.startGame(gameId).subscribe();
  }

  canCreateRoom(): boolean {
    return !this.filteredGames.some(x => x.players.includes(this.authService.getUsername()));
  }

  canJoinRoom(gameId: string): boolean {
    if (this.filteredGames.some(x => x.players.includes(this.authService.getUsername()))) {
      return false;
    }
    let game = this.filteredGames.find(x => x.id === gameId);
    if (game?.players.includes(this.authService.getUsername())) {
      return false;
    }
    if (game?.players.length == 5) {
      return false;
    }
    return true;
  }
  
  canLeaveRoom(gameId: string): boolean { 
    let game = this.filteredGames.find(x => x.id === gameId);
    if (game?.players.includes(this.authService.getUsername())) {
      return true;
    }
    return false;
  }

  canStartGame(gameId: string): boolean {
    let game = this.filteredGames.find(x => x.id === gameId);
    if (game!.players.length < 2) {
      return false;
    }
    if (game?.players[0] == this.authService.getUsername()) {
      return true;
    }
    return false;
  }

  get filteredGames(): IGame[] {
    return this.games.filter((game: IGame) =>
      game.roomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      game.players.map(x => x.toLocaleLowerCase()).some(x => x.includes(this.listFilter.toLocaleLowerCase())))
  }
}

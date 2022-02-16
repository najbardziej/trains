import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { GameRoom } from '../model/game-room';
import { LobbyService } from './lobby.service';
import { SocketService } from '../socket/socket.service';

@Component({
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit, OnDestroy {

  gameRooms: GameRoom[] = [];
  listFilter: string = '';
  subscription!: Subscription;
  gameSubscription!: Subscription;

  constructor(
    private readonly router: Router,
    private readonly lobbyService: LobbyService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.lobbyService.getGameRooms().subscribe(
      ((gameRooms: GameRoom[]) => this.gameRooms = gameRooms),
      (err) => console.error(err)
    );

    this.socketService.identify(this.authService.getUsername());

    this.subscription = this.socketService.getGameRoomsObservable().subscribe((gameRooms: GameRoom[]) => {
      this.gameRooms = gameRooms;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.gameSubscription.unsubscribe();
  }

  private createGameObservable(id: string) {
    this.gameSubscription = this.socketService.getRoomObservable(id).subscribe((game: any) => {
      this.router.navigate([`/game/${game.id}`]);
    })
  }

  createGameRoom() {
    this.lobbyService.createGameRoom().subscribe((data: any) => {
      this.createGameObservable(data.id);
    });
  }

  joinGameRoom(gameRoomId: string) {
    this.lobbyService.joinGameRoom(gameRoomId).subscribe(() => {
      this.createGameObservable(gameRoomId);
    });
  }

  leaveGameRoom(gameRoomId: string) {
    this.lobbyService.leaveGameRoom(gameRoomId).subscribe();
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  startGame(gameRoomId: string) {
    this.lobbyService.startGame(gameRoomId).subscribe();
  }

  canCreateRoom(): boolean {
    return !this.filteredRooms.some(x => x.players.includes(this.authService.getUsername()));
  }

  canJoinRoom(gameRoomId: string): boolean {
    if (this.filteredRooms.some(x => x.players.includes(this.authService.getUsername()))) {
      return false;
    }
    let gameRoom = this.filteredRooms.find(x => x.id === gameRoomId);
    if (gameRoom?.players.includes(this.authService.getUsername())) {
      return false;
    }
    if (gameRoom?.players.length == 5) {
      return false;
    }
    return true;
  }
  
  canLeaveRoom(gameRoomId: string): boolean { 
    let gameRoom = this.filteredRooms.find(x => x.id === gameRoomId);
    if (gameRoom?.players.includes(this.authService.getUsername())) {
      return true;
    }
    return false;
  }

  canStartGame(gameRoomId: string): boolean {
    let gameRoom = this.filteredRooms.find(x => x.id === gameRoomId);
    if (gameRoom!.players.length < 2) {
      return false;
    }
    if (gameRoom?.players[0] == this.authService.getUsername()) {
      return true;
    }
    return false;
  }

  get filteredRooms(): GameRoom[] {
    return this.gameRooms.filter((gameRoom: GameRoom) =>
      gameRoom.roomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      gameRoom.players.map(x => x.toLocaleLowerCase()).some(x => x.includes(this.listFilter.toLocaleLowerCase())))
  }
}

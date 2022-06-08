import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, pipe, Subscription, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { COLOR } from '../model/color';
import { Game } from '../model/game';
import { GameMap } from '../model/game-map';
import { Player } from '../model/player';
import { SocketService } from '../socket/socket.service';
import { GameMapComponent } from './game-map/game-map.component';
import { GameService } from './game.service';

@Component({
  selector: 'trains-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly gameService: GameService,
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    private readonly toastrService: ToastrService,
  ) { }

  @ViewChild(GameMapComponent) gameMapComponent!: GameMapComponent;

  private gameSubscription!: Subscription;
  private mapSubscription!: Subscription;
  private messageSubscription!: Subscription;
  
  private selectedRoute: any = null;

  game: Game = this.route.snapshot.data.game;
  gameMap: GameMap = this.route.snapshot.data.gameMap;

  get player() {
    return this.game.players.find((p: Player) => p.username === this.authService.getUsername());
  }

  get playerIndex() {
    return this.game.players.findIndex((p: Player) => p.username === this.authService.getUsername());
  }
  
  get playerCards() {
    return Array.from(this.player.cards.entries()).map(([i, x]: any) => ({ card: i, quantity: x }))
  }

  ngOnInit(): void {
    this.gameSubscription = this.socketService.getGameObservable(this.game.id)
      .subscribe((game: Game) => {
        this.game = game;
    });

    this.mapSubscription = this.socketService.getGameMapObservable(this.game.id)
      .subscribe((gameMapData: any) => {
        this.gameMap = gameMapData;
    });

    this.messageSubscription = this.socketService.getMessageObservable(this.game.id)
      .subscribe((message: any) => {
        this.toastrService.info(message);
    });
  }

  onMissionSelected(missionId: number) {
    this.gameService.discardMission(this.game.id, missionId)
      .pipe(take(1))
      .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
      .subscribe();
  }

  onMissionDrawClick() {
    this.gameService.drawMissions(this.game.id)
      .pipe(take(1))
      .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
      .subscribe();
  }

  onMissionAcceptClick() {
    this.gameService.acceptMissions(this.game.id)
      .pipe(take(1))
      .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
      .subscribe();
  }

  onColorSelected(color: number) {
    console.log(color, this.selectedRoute);
    if (this.selectedRoute) {
      this.selectedRoute.color = color;
      this.gameService.buyRoute(this.game.id, this.selectedRoute)
        .pipe(take(1))
        .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
        .subscribe();
      this.selectedRoute = null;
    }
  }

  onRouteSelected(route: any) {
    if (route.color == COLOR.GRAY) {
      this.selectedRoute = route;
      this.toastrService.info("Select color ->");
      return;
    }
    this.gameService.buyRoute(this.game.id, route)
      .pipe(take(1))
      .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
      .subscribe();
    this.selectedRoute = null;
  }

  onCardSelected(card: number) {
    this.gameService.drawCard(this.game.id, card)
      .pipe(take(1))
      .pipe(catchError(err => { this.toastrService.error(err.error.message); return throwError(() => err); }))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
    this.mapSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }
}

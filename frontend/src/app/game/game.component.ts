import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { COLOR } from '../model/color';
import { Game } from '../model/game';
import { SocketService } from '../socket/socket.service';
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

  private selectedRoute: any = null;
  private subscription!: Subscription;

  game: Game = this.route.snapshot.data.game;

  get player() {
    return this.game.players.find((p: any) => p.username === this.authService.getUsername());
  }

  get playerCards() {
    return Array.from(this.player.cards.entries()).map(([i, x]: any) => ({ card: i, quantity: x }))
  }

  ngOnInit(): void {
    this.subscription = this.socketService.getGameObservable(this.game.id)
      .subscribe((game: Game) => {
        this.game = game;
        console.log(game);
    });
  }

  onMissionSelected(missionId: number) {
    this.gameService.discardMission(this.game.id, missionId).pipe(take(1)).subscribe();
  }

  onMissionDrawClick() {
    this.gameService.drawMissions(this.game.id).pipe(take(1)).subscribe();
  }

  onMissionAcceptClick() {
    this.gameService.acceptMissions(this.game.id).pipe(take(1)).subscribe();
  }

  onColorSelected(color: number) {
    console.log(color, this.selectedRoute);
    if (this.selectedRoute) {
      this.selectedRoute.color = color;
      this.gameService.buyRoute(this.game.id, this.selectedRoute).pipe(take(1)).subscribe();
      this.selectedRoute = null;
    }
  }

  onRouteSelected(route: any) {
    if (route.color == COLOR.GRAY) {
      this.selectedRoute = route;
      this.toastrService.info("Select color ->", "", { timeOut: 6000 });
      return;
    }
    this.gameService.buyRoute(this.game.id, route).pipe(take(1)).subscribe();
    this.selectedRoute = null;
  }

  onCardSelected(card: number) {
    this.gameService.drawCard(this.game.id, card).pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

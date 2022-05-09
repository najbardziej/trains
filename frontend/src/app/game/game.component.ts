import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  ) { }

  public game: Game = this.route.snapshot.data.game;
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.socketService.getGameObservable(this.game.id)
      .subscribe((game: Game) => {
        this.game = game;
        console.log(game);
    });
  }

  onCardSelected(card: number) {
    this.gameService.drawCard(this.game.id, card).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

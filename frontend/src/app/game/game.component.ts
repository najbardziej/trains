import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../model/game';
import { GameService } from './game.service';

@Component({
  selector: 'trains-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private readonly gameService: GameService
  ) { }

  public game: Game = this.route.snapshot.data.game;

  ngOnInit(): void {

  }
}

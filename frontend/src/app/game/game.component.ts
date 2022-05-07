import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private gameId: string = "";

  ngOnInit(): void {
    this.gameId = this.route.snapshot.params.id;

    this.gameService.getGameData(this.gameId).subscribe(x => console.log(x));
  }

}

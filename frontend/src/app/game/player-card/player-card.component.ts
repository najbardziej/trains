import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {

  constructor() { }

  @Input() card: number = -1;
  @Input() quantity: number = 0;

  class: string = "game-card--unknown"
  
  ngOnInit(): void {
    if (this.card >= 0) {
      this.class = [
        "game-card--joker",
        "game-card--red",   
        "game-card--blue",  
        "game-card--green", 
        "game-card--yellow",
        "game-card--purple",
        "game-card--orange",
        "game-card--white", 
        "game-card--black",
      ][this.card];
    }
  }

}

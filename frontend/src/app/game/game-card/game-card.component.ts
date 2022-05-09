import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {

  constructor() { }

  @Input() index: number = -1;
  @Input() card: number = -1;

  class: string = "game-card--unknown"
  
  @Output() cardSelected: EventEmitter<number> = new EventEmitter();

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

  selectCard(): void {
    console.log(this.index);
    this.cardSelected.emit(this.index);
  }

}

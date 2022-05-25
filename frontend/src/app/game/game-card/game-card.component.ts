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

  @Output() cardSelected: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void { }

  selectCard(): void {
    this.cardSelected.emit(this.index);
  }

}

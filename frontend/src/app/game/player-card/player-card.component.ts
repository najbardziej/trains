import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {

  constructor() { }

  @Input() card: number = -1;
  @Input() quantity: number = 0;

  @Output() colorSelected: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void { }

  selectColor(): void {
    this.colorSelected.emit(this.card);
  }
  
}

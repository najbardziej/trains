import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent {

  constructor() { }

  @Input() card: number = -1;
  @Input() quantity: number = 0;

  @Output() colorSelected: EventEmitter<number> = new EventEmitter();

  selectColor(): void {
    this.colorSelected.emit(this.card);
  }
}

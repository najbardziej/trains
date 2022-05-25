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
 
  ngOnInit(): void { }
  
}

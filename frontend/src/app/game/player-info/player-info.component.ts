import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit {

  constructor() { }

  @Input() player: any;
  @Input() index: number = -1;
  @Input() active: boolean = false;

  cardCount = () => this.player.cards.reduce((x: number, y: number) => x + y);
  missionCount = () => this.player.missions.length;

  ngOnInit(): void {
  }

}

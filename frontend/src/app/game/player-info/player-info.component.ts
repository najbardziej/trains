import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/model/player';

@Component({
  selector: 'player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent {

  constructor() { }

  @Input() player: Player = {
    username: '',
    cards: [],
    points: 0,
    trains: 0,
    availableMissions: [],
    missions: []
  };
  @Input() index: number = -1;
  @Input() active: boolean = false;

  cardCount = () => this.player.cards.reduce((x: number, y: number) => x + y, 0);
  missionCount = () => this.player.missions.length;

}

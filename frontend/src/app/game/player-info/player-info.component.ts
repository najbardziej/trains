import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss']
})
export class PlayerInfoComponent implements OnInit {

  constructor() { }

  @Input() player: any;

  ngOnInit(): void {
  }

}

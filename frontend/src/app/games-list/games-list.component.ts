import { Component, OnInit } from '@angular/core';
import { IGame } from './game';

@Component({
  selector: 'trains-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  private _listFilter: string = '';
  get listFilter(): string { return this._listFilter };
  set listFilter(value: string) { this._listFilter = value };

  get filteredGames(): IGame[] {
    return this.games.filter((game: IGame) => 
      game.RoomName.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) ||
      game.Player1.toLocaleLowerCase().includes(this.listFilter.toLocaleLowerCase()) )
  }

  games : IGame[] = [
    {
      "GameId": 1,
      "RoomName": "Test1",
      "Player1": "Asdfg",
      "Player2": "",
      "Player3": "",
      "Player4": "",
      "Player5": "",
    },
    {
      "GameId": 2,
      "RoomName": "Test2",
      "Player1": "Asdfg",
      "Player2": "",
      "Player3": "",
      "Player4": "",
      "Player5": "",
    },
    {
      "GameId": 3,
      "RoomName": "Test3",
      "Player1": "Asdfg",
      "Player2": "",
      "Player3": "",
      "Player4": "",
      "Player5": "",
    },
    {
      "GameId": 4,
      "RoomName": "Test4",
      "Player1": "Asdfg",
      "Player2": "",
      "Player3": "",
      "Player4": "",
      "Player5": "",
    }
  ]

}

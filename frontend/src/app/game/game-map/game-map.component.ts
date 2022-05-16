import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  createTrain(event: any) {
    const gameMap = document.querySelector('game-map');
    const mapWidth = gameMap!.getBoundingClientRect().width;
    const mapHeight = gameMap!.getBoundingClientRect().height;
    const train = document.createElement('train');
    train.style.position = "absolute";
    train.style.top = `${(event.clientY / mapHeight) * 100}%`;
    train.style.right = `${(gameMap!.getBoundingClientRect().right - event.clientX) / mapWidth * 100}%`;
    train.style.width = "45px";
    train.style.height = "15px";
    train.style.background = "gray";
    train.style.boxShadow = "2px 2px 7px black, inset 2px 2px 5px rgba(255, 255, 255, 0.7)";
    train.style.border = "2px solid darkgray"
    train.style.cursor = "pointer"
    gameMap!.appendChild(train);
  }

}

import { Component, OnInit } from '@angular/core';
import { contain } from 'intrinsic-scale';

const MAP_HEIGHT = 921.633;
const MAP_WIDTH = 1408;

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.rescaleMap();
  }

  rescaleMap() {
    const gameMapOverlay = document.querySelector('.game-map__overlay') as HTMLElement;
    const gameMap = document.querySelector('game-map');
    const gameMapWidth = gameMap!.getBoundingClientRect().width;
    const gameMapHeight = gameMap!.getBoundingClientRect().height;
    console.log({gameMapWidth, gameMapHeight}, contain(gameMapWidth, gameMapHeight, MAP_WIDTH, MAP_HEIGHT));
    let { width, height, x, y } = contain(gameMapWidth, gameMapHeight, MAP_WIDTH, MAP_HEIGHT);
    const scale = width / MAP_WIDTH;
    gameMapOverlay.style.transform = `scale(${scale})`;
  }

  createTrain(event: any) {
    const gameMap = document.querySelector('game-map');
    const gameMapOverlay = document.querySelector('.game-map__overlay');
    const mapWidth = gameMap!.getBoundingClientRect().width;
    const mapHeight = gameMap!.getBoundingClientRect().height;
    const train = document.createElement('div');
    train.classList.add("train");
    train.style.top = `${(event.clientY / mapHeight) * 100}%`;
    train.style.right = `${(gameMap!.getBoundingClientRect().right - event.clientX) / mapWidth * 100}%`;

    gameMapOverlay!.appendChild(train);
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { contain } from 'intrinsic-scale';

const MAP_HEIGHT = 921.633;
const MAP_WIDTH = 1408;

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameMapOverlay = document.querySelector('.game-map__overlay') as HTMLElement;
    this.createMapElements();
    this.rescaleMap();
  }

  private gameMapOverlay!: HTMLElement;
  mapData: any = this.route.snapshot.data.gameMap;

  createMapElements() {
    // Create node elements
    this.mapData.nodes.forEach((node: any) => {
      this.gameMapOverlay.appendChild(
        this.createNode(node.x, node.y)
      );
    });
    // Create train elements
    this.mapData.edges.forEach((edge: any) => {
      // get start and end nodes
      let [start, end] = [
        this.mapData.nodes.filter((node: any) => node.id === edge.nodes[0])[0],
        this.mapData.nodes.filter((node: any) => node.id === edge.nodes[1])[0]
      ];
      // Move line to center
      let [startX, endX] = [start.x - 10, end.x - 10];
      let [startY, endY] = [start.y + 10, end.y + 10];

      // Avoid collision with node 
      let theta = Math.atan2(startY - endY, startX - endX);
      let [dx, dy] = [15 * Math.cos(theta), 15 * Math.sin(theta)];

      [startX, endX] = [startX - dx, endX + dx];
      [startY, endY] = [startY - dy, endY + dy];

      // Create trains in equal distances
      [dx, dy] = [
        (endX - startX) / (edge.length * 2),
        (endY - startY) / (edge.length * 2)
      ];
      let [x, y] = [startX + dx, startY + dy];

      for (let i = 0; i < edge.length; i++) {
        this.gameMapOverlay.appendChild(
          this.createTrain(x + 25, y - 10, theta)
        );
        x += dx * 2;
        y += dy * 2;
      }
    });
  }

  private createNode(x: number, y: number) {
    const node = document.createElement('div');
    node.classList.add("node");
    node.style.top = `${y}px`;
    node.style.right = `${(this.gameMapOverlay.getBoundingClientRect().right - x)}px`;
    return node;
  }

  private createTrain(x: number, y: number, angle: number = 0) {
    const train = document.createElement('div');
    train.classList.add("train");
    train.style.top = `${y}px`;
    train.style.right = `${(this.gameMapOverlay.getBoundingClientRect().right - x)}px`;
    train.style.transform = `rotate(${angle}rad)`;
    return train;
  }

  rescaleMap() {
    const gameMap = document.querySelector('game-map');
    const gameMapWidth = gameMap!.getBoundingClientRect().width;
    const gameMapHeight = gameMap!.getBoundingClientRect().height;
    let { width, height, x, y } = contain(gameMapWidth, gameMapHeight, MAP_WIDTH, MAP_HEIGHT);
    const scale = width / MAP_WIDTH;
    this.gameMapOverlay.style.transform = `scale(${scale})`;
  }

  onClick(event: any) {
    navigator.clipboard.writeText(JSON.stringify({
      "id": 0,
      "name": "",
      "x": event.clientX + 10,
      "y": event.clientY - 10
    }) + ',');
  }
}

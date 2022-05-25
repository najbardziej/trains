import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { contain } from 'intrinsic-scale';

const MAP_HEIGHT = 921.633;
const MAP_WIDTH = 1408;
const BOUNDING_MAP_RECT_RIGHT_FHD = 1728;
const NODE_CREATION_MODE = false;
const EDGE_CREATION_MODE = false;

const MIN_NODE_SPACING = 14;
const TRAIN_WIDTH = 44;
const TRAIN_HEIGHT = 16;
const NODE_RADIUS = 9;

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit, AfterViewInit {

  constructor(private readonly route: ActivatedRoute) { }

  private gameMap!: HTMLElement;
  private gameMapOverlay!: HTMLElement;
  private helperNodes: number[] = [];

  mapData: any = this.route.snapshot.data.gameMap;

  ngOnInit(): void {
    this.gameMapOverlay = document.querySelector('.game-map__overlay') as HTMLElement;
    this.gameMap = document.querySelector('game-map') as HTMLElement;
    this.createMapElements();
  }

  ngAfterViewInit(): void {
    this.rescaleMap();
  }

  createMapElements() {
    // Create node elements
    this.mapData.nodes.forEach((node: any) => {
      this.gameMapOverlay.appendChild(
        this.createNode(node.x, node.y, node.id)
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
      let [startX, endX] = [start.x - NODE_RADIUS, end.x - NODE_RADIUS];
      let [startY, endY] = [start.y + NODE_RADIUS, end.y + NODE_RADIUS];

      // Avoid collision with node 
      let length = Math.hypot(endX - startX, endY - startY);
      let trainSpacing = (length - (MIN_NODE_SPACING * 2)) / edge.length - TRAIN_WIDTH;
      let spacing = Math.max(trainSpacing, MIN_NODE_SPACING);
      console.log(trainSpacing, spacing, start.name, end.name);
      let theta = Math.atan2(startY - endY, startX - endX);
      let [dx, dy] = [spacing * Math.cos(theta), spacing * Math.sin(theta)];

      [startX, endX] = [startX - dx, endX + dx];
      [startY, endY] = [startY - dy, endY + dy];

      // Create trains in equal distances
      [dx, dy] = [
        (endX - startX) / (edge.length * 2),
        (endY - startY) / (edge.length * 2)
      ];
      let [x, y] = [startX + dx, startY + dy];

      let routeContainer = document.createElement('div');
      routeContainer.classList.add("route-container");

      for (let i = 0; i < edge.length; i++) {
        routeContainer.appendChild(
          this.createTrain(
            x + (TRAIN_WIDTH / 2), 
            y - (TRAIN_HEIGHT / 2), 
            edge.color,
            theta)
        );
        x += dx * 2;
        y += dy * 2;
      }

      this.gameMapOverlay.appendChild(routeContainer);
    });
  }

  private createNode(x: number, y: number, id: string) {
    const node = document.createElement('div');
    node.classList.add("node");
    node.style.top = `${y}px`;
    node.style.right = `${(BOUNDING_MAP_RECT_RIGHT_FHD - x)}px`;
    node.dataset.id = id;
    if (EDGE_CREATION_MODE) {
      node.addEventListener("click", (event) => {
        this.helperNodes.push(+node.dataset.id!);
        if (this.helperNodes.length === 1) {
          return;
        }
        
        let [start, end] = [
          this.mapData.nodes.filter((node: any) => node.id === this.helperNodes[0])[0],
          this.mapData.nodes.filter((node: any) => node.id === this.helperNodes[1])[0]
        ];        
        
        let length = Math.hypot(start.x - end.x, start.y - end.y);

        navigator.clipboard.writeText(JSON.stringify({
          "id": 0,
          "nodes": this.helperNodes,
          "length": Math.floor((length - MIN_NODE_SPACING * 2) / (TRAIN_WIDTH + 4))
        }));
        this.helperNodes = [];
      });
    }
    return node;
  }

  private createTrain(x: number, y: number, color: number = 9, angle: number = 0) {
    const train = document.createElement('div');
    train.classList.add("train");
    train.dataset.color = color.toString();
    train.style.top = `${y}px`;
    train.style.right = `${(BOUNDING_MAP_RECT_RIGHT_FHD - x)}px`;
    train.style.transform = `rotate(${angle}rad)`;
    return train;
  }

  rescaleMap() {
    const gameMapWidth = this.gameMap.getBoundingClientRect().width;
    const gameMapHeight = this.gameMap.getBoundingClientRect().height;
    let { width, height, x, y } = contain(gameMapWidth, gameMapHeight, MAP_WIDTH, MAP_HEIGHT);
    const scale = width / MAP_WIDTH;
    this.gameMapOverlay.style.transform = `scale(${scale})`;
  }

  onClick(event: any) {
    if (!NODE_CREATION_MODE) {
      return;
    }

    navigator.clipboard.writeText(JSON.stringify({
      "id": 0,
      "name": "",
      "x": event.clientX + NODE_RADIUS,
      "y": event.clientY - NODE_RADIUS
    }));
  }
}

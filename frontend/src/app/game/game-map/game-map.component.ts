import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { contain } from 'intrinsic-scale';
import { Subject } from 'rxjs';
import { GameMap } from 'src/app/model/game-map';

const MAP_HEIGHT = 921.633;
const MAP_WIDTH = 1408;
const BOUNDING_MAP_RECT_RIGHT_FHD = 1728;

const MIN_NODE_SPACING = 14;
const TRAIN_WIDTH = 44;
const TRAIN_HEIGHT = 16;
const NODE_RADIUS = 9;

const NODE_CREATION_MODE = false;
const EDGE_CREATION_MODE = false;

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  constructor() { }

  private gameMapElement!: HTMLElement;
  private gameMapOverlay!: HTMLElement;
  private helperNodes: number[] = [];
  
  private onChanges = new Subject<SimpleChanges>();

  @Input() gameMap: GameMap = { edges: [], nodes: [] };
  @Output() routeSelected: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.gameMapOverlay = document.querySelector('.game-map__overlay') as HTMLElement;
    this.gameMapElement = document.querySelector('game-map') as HTMLElement;
    this.createMapElements();
    this.onChanges.subscribe((changes: SimpleChanges) => {
      if (changes.gameMap) {
        this.updateMap();
      }
    })
  }

  ngOnDestroy(): void {
    this.onChanges.unsubscribe();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.onChanges.next(changes);
  }

  ngAfterViewInit(): void {
    this.rescaleMap();
  }  

  updateMap() {
    this.removeMapElements();
    this.createMapElements();
  }

  removeMapElements() {
    document.querySelectorAll(".route-container").forEach(r => r.remove()) 
    document.querySelectorAll(".node").forEach(n => n.remove()) 
  }

  createMapElements() {
    // Create node elements
    this.gameMap.nodes.forEach((node: any) => {
      this.gameMapOverlay.appendChild(
        this.createNode(node.x, node.y, node.id, node.name)
      );
    });
    // Create train elements
    this.gameMap.edges.forEach((edge: any) => {
      // get start and end nodes
      let [start, end] = [
        this.gameMap.nodes.filter((node: any) => node.id === edge.nodes[0])[0],
        this.gameMap.nodes.filter((node: any) => node.id === edge.nodes[1])[0]
      ];
      // Move line to center
      let [startX, endX] = [start.x - NODE_RADIUS, end.x - NODE_RADIUS];
      let [startY, endY] = [start.y + NODE_RADIUS, end.y + NODE_RADIUS];

      // Avoid collision with node 
      let length = Math.hypot(endX - startX, endY - startY);
      let trainSpacing = (length - (MIN_NODE_SPACING * 2)) / edge.length - TRAIN_WIDTH;
      let spacing = Math.max(trainSpacing, MIN_NODE_SPACING);
      // console.log(trainSpacing, spacing, start.name, end.name);
      let theta = Math.atan2(startY - endY, startX - endX);
      let [dx, dy] = [spacing * Math.cos(theta), spacing * Math.sin(theta)];

      [startX, endX] = [startX - dx, endX + dx];
      [startY, endY] = [startY - dy, endY + dy];
      
      // Create trains in equal distances
      if (!edge.owner && edge.owner !== 0) {
        [dx, dy] = [
          (endX - startX) / (edge.length * 2),
          (endY - startY) / (edge.length * 2)
        ];
        let [x, y] = [startX + dx, startY + dy];

        let routeContainer = document.createElement('div');
        routeContainer.classList.add("route-container");
        routeContainer.dataset.id = edge.id;
        routeContainer.addEventListener("click", (event) => {
          this.routeSelected.emit(edge);
        })

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
      } else {
        this.gameMapOverlay.appendChild(
          this.createRoute(
            (startX + endX) / 2 + (length - 20) / 2, 
            (startY + endY) / 2 - 5, 
            length - 20,
            edge.owner,
            theta)
        );
      }
    });
  }

  private createNode(x: number, y: number, id: string, name: string) {
    const node = document.createElement('div');
    node.classList.add("node");
    node.style.top = `${y}px`;
    node.style.right = `${(BOUNDING_MAP_RECT_RIGHT_FHD - x)}px`;
    node.dataset.id = id;

    const nodeLabel = document.createElement('div');
    nodeLabel.classList.add("node__label");
    nodeLabel.textContent = name;
    node.appendChild(nodeLabel);

    if (EDGE_CREATION_MODE) {
      node.addEventListener("click", (event) => {
        this.helperNodes.push(+node.dataset.id!);
        if (this.helperNodes.length === 1) {
          return;
        }
        
        let [start, end] = [
          this.gameMap.nodes.filter((node: any) => node.id === this.helperNodes[0])[0],
          this.gameMap.nodes.filter((node: any) => node.id === this.helperNodes[1])[0]
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

  private createRoute(x: number, y: number, width: number, color: number = 9, angle: number = 0) {
    const route = document.createElement('div');
    route.classList.add("route");
    route.dataset.playercolor = color.toString();
    route.style.top = `${y}px`;
    route.style.right = `${(BOUNDING_MAP_RECT_RIGHT_FHD - x)}px`;
    route.style.transform = `rotate(${angle}rad)`;
    route.style.width = `${width}px`;
    return route;
  }

  rescaleMap() {
    const gameMapWidth = this.gameMapElement?.getBoundingClientRect().width || 0;
    const gameMapHeight = this.gameMapElement?.getBoundingClientRect().height || 0;
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

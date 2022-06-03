import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import Graph from 'node-dijkstra';

const ALMOST_ZERO = 1e-20; // Hack for external lib not allowing 0 as graph edge length

@Component({
  selector: 'player-mission',
  templateUrl: './player-mission.component.html',
  styleUrls: ['./player-mission.component.scss']
})
export class PlayerMissionComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input() mission: any;
  @Input() gameMap: any;
  @Input() playerIndex: any;
  @Input() active: boolean = false;
  @Output() missionSelected: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.removeHighlighting();
  }

  private addHighlighting = () => this.mission.nodes.forEach((node: any) => {
    this.getNode(node).classList.add("node--highlighted");
  });

  private removeHighlighting = () => this.mission.nodes.forEach((node: any) => {
    this.getNode(node).classList.remove("node--highlighted");
  });

  onMouseOver = () => this.addHighlighting();
  onMouseOut = () => this.removeHighlighting();
  onClick = () => this.missionSelected.emit(this.mission.id);

  getNode = (nodeId: number) => document.querySelector(`.node[data-id='${nodeId}']`)!;
  getNodeName = (nodeId: number): string => this.getNode(nodeId).textContent || "";
  
  get isPossible() : boolean {
    const [fullPathCost, remainingPathCost] = this.pathCost;
    return fullPathCost !== 0 || remainingPathCost !== 0
  }

  get isFinished() : boolean {
    const [fullPathCost, remainingPathCost] = this.pathCost;
    if (fullPathCost === 0 && remainingPathCost === 0) {
      return false;
    }
    return remainingPathCost === 0;
  }

  get progress() {
    const [fullPathCost, remainingPathCost] = this.pathCost;
    return `${(fullPathCost - remainingPathCost) / fullPathCost * 100}%`;
  }

  get caption() {
    return `${this.getNodeName(this.mission.nodes[0])} - ${this.getNodeName(this.mission.nodes[1])}`;
  }

  get pathCost(): number[] {
    const graph: Record<string, any> = {};
    this.gameMap.nodes.forEach((node: any) => {
      graph[node.id] = {};
      this.gameMap.edges.forEach((edge: any) => {
        if (edge.nodes.some((n: any) => n == node.id)) {
          let otherId = edge.nodes.find((x: any) => x != node.id)
          if (edge.owner == this.playerIndex) {
            graph[node.id][otherId] = ALMOST_ZERO;
          } else if (!edge.owner) {
            graph[node.id][otherId] = edge.length;
          }
        }
      })
    })
    const path: any = (new Graph(graph)).path(
      this.mission.nodes[0].toString(),
      this.mission.nodes[1].toString(),
      { cost: true }
    ); 

    if (path.path == null) {
      return [0, 0];
    }

    let fullPathCost = 0;
    for (let i = 0; i < path.path.length - 1; i++) {
      const [edge1, edge2] = [+path.path[i], +path.path[i + 1]];
      fullPathCost += this.gameMap.edges.find((e: any) => e.nodes.includes(edge1) && e.nodes.includes(edge2)).length;
    }

    return [fullPathCost, Math.floor(path.cost)];
  }
}

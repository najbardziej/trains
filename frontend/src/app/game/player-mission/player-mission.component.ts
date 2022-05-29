import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'player-mission',
  templateUrl: './player-mission.component.html',
  styleUrls: ['./player-mission.component.scss']
})
export class PlayerMissionComponent implements OnInit, OnDestroy {

  constructor() { }

  @Input() mission: any;
  @Input() active: boolean = false;
  @Output() missionSelected: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {      
  }

  ngOnDestroy(): void {
    this.removeHighlighting();
  }

  onClick(event: any) {
    this.missionSelected.emit(this.mission.id);
  }

  getNode(nodeId: number) {
    return document.querySelector(`.node[data-id='${nodeId}']`)!;
  }

  getNodeName(nodeId: number): string {
    return this.getNode(nodeId).textContent || "";
  }

  onMouseOver() {
    const node1 = this.getNode(this.mission.nodes[0]);
    const node2 = this.getNode(this.mission.nodes[1]);
    node1.classList.add("node--highlighted");
    node2.classList.add("node--highlighted");
  }

  removeHighlighting() {
    const node1 = this.getNode(this.mission.nodes[0]);
    const node2 = this.getNode(this.mission.nodes[1]);
    node1.classList.remove("node--highlighted");
    node2.classList.remove("node--highlighted");
  }

  onMouseOut() {
    this.removeHighlighting();
  }

  get caption() {
    return `${this.getNodeName(this.mission.nodes[0])} - 
      ${this.getNodeName(this.mission.nodes[1])}`;
  }
}

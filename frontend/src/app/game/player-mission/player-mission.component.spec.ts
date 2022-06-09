import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMissionComponent } from './player-mission.component';

describe('PlayerMissionComponent', () => {
  let component: PlayerMissionComponent;
  let fixture: ComponentFixture<PlayerMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerMissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerMissionComponent);
    component = fixture.componentInstance;
    component.playerIndex = 1;
    component.gameMap = {
      nodes: [
        {"id":0,"name":"Warszawa","x":1082,"y":407},
        {"id":1,"name":"Lódź","x":978,"y":456},
        {"id":2,"name":"Poznań","x":811,"y":386},
        {"id":3,"name":"Bydgoszcz","x":883,"y":307},
        {"id":4,"name":"Białystok","x":1226,"y":306},
        {"id":5,"name":"Wrocław","x":817,"y":525},
      ],
      edges: [
        {"id":0,"nodes":[0,1],"length":1},
        {"id":1,"nodes":[0,2],"length":5},
        {"id":2,"nodes":[0,4],"length":3},
        {"id":7,"nodes":[2,3],"length":1},
        {"id":10,"nodes":[5,1],"length":3},
        {"id":11,"nodes":[5,2],"length":2},
        {"id":97,"nodes":[0,3],"length":4},
      ],
    }
    component.mission = { id: 0, nodes: [4, 5], points: 7 };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should correctly calculate mission progress and status', () => {
    it('if none of edges is bought', () => {
      expect(component.isFinished).toBeFalse();
      expect(component.isPossible).toBeTrue();
      expect(component.progress).toEqual("0%");
      expect(component.pathCost).toEqual([7, 7]);
    });

    it('if some edges are bought', () => {
      component.gameMap.edges.find(e => e.id == 97).owner = 1;
      component.gameMap.edges.find(e => e.id == 7).owner = 1;
      component.gameMap.edges.find(e => e.id == 11).owner = 1;

      expect(component.isFinished).toBeFalse();
      expect(component.isPossible).toBeTrue();
      expect(component.pathCost).toEqual([10, 3]);
      expect(component.progress).toEqual(`${7/10 * 100}%`);
    });

    it('if there is obstacle on shortest path', () => {
      component.gameMap.edges.find(e => e.id == 0).owner = 0;
      component.gameMap.edges.find(e => e.id == 2).owner = 1;

      expect(component.isFinished).toBeFalse();
      expect(component.isPossible).toBeTrue();
      expect(component.pathCost).toEqual([10, 7]);
      expect(component.progress).toEqual(`${3/10 * 100}%`);
    });

    it('if is not possible', () => {
      component.gameMap.edges.find(e => e.id == 2).owner = 0;
      expect(component.isFinished).toBeFalse();
      expect(component.isPossible).toBeFalse();
      expect(component.pathCost).toEqual([0, 0]);
    });
  })
});

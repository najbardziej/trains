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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

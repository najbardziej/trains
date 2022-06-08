import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        SocketIoModule.forRoot({ url: "", options: {}}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { data: {
              game: {
                players: [{username: "", availableMissions: [], cards: [0, 1, 1]}]
              },
              gameMap: {}
            }}
          }
        },
        
      ],
      declarations: [GameComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

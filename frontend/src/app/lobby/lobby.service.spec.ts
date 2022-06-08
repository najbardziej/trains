import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LobbyService } from './lobby.service';

describe('LobbyService', () => {
  let service: LobbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(LobbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

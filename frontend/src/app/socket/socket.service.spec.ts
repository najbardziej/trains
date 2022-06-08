import { TestBed } from '@angular/core/testing';
import { SocketIoModule } from 'ngx-socket-io';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot({ url: "", options: {}}) ]
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

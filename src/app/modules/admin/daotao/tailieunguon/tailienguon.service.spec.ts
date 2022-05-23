import { TestBed } from '@angular/core/testing';

import { TailienguonService } from './tailienguon.service';

describe('TailienguonService', () => {
  let service: TailienguonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailienguonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

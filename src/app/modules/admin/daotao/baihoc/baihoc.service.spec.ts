import { TestBed } from '@angular/core/testing';

import { BaihocService } from './baihoc.service';

describe('BaihocService', () => {
  let service: BaihocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaihocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

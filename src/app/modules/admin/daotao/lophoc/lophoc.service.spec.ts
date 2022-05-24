import { TestBed } from '@angular/core/testing';

import { LophocService } from './lophoc.service';

describe('LophocService', () => {
  let service: LophocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LophocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

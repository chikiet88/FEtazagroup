import { TestBed } from '@angular/core/testing';

import { CauhinhService } from './cauhinh.service';

describe('CauhinhService', () => {
  let service: CauhinhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CauhinhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { VetuyendungGuard } from './vetuyendung.guard';

describe('VetuyendungGuard', () => {
  let guard: VetuyendungGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VetuyendungGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

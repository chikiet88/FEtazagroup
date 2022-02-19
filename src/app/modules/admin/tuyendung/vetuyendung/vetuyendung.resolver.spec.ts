import { TestBed } from '@angular/core/testing';

import { VetuyendungResolver } from './vetuyendung.resolver';

describe('VetuyendungResolver', () => {
  let resolver: VetuyendungResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(VetuyendungResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

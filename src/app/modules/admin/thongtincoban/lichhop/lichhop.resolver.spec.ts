import { TestBed } from '@angular/core/testing';

import { LichhopResolver } from './lichhop.resolver';

describe('LichhopResolver', () => {
  let resolver: LichhopResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LichhopResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

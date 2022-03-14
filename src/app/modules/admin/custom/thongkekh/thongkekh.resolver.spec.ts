import { TestBed } from '@angular/core/testing';

import { ThongkekhResolver } from './thongkekh.resolver';

describe('ThongkekhResolver', () => {
  let resolver: ThongkekhResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ThongkekhResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

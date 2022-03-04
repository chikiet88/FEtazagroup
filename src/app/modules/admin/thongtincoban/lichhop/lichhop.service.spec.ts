import { TestBed } from '@angular/core/testing';

import { LichhopService } from './lichhop.service';

describe('LichhopService', () => {
  let service: LichhopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LichhopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

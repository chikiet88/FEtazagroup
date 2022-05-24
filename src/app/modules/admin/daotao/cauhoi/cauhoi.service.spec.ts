import { TestBed } from '@angular/core/testing';

import { CauhoiService } from './cauhoi.service';

describe('CauhoiService', () => {
  let service: CauhoiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CauhoiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

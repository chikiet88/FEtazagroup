import { TestBed } from '@angular/core/testing';

import { DethiService } from './dethi.service';

describe('DethiService', () => {
  let service: DethiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DethiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

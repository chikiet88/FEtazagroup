import { TestBed } from '@angular/core/testing';

import { VetuyendungService } from './vetuyendung.service';

describe('VetuyendungService', () => {
  let service: VetuyendungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VetuyendungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

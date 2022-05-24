import { TestBed } from '@angular/core/testing';

import { KythiService } from './kythi.service';

describe('KythiService', () => {
  let service: KythiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KythiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

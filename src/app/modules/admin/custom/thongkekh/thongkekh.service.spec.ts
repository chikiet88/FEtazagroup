import { TestBed } from '@angular/core/testing';

import { ThongkekhService } from './thongkekh.service';

describe('ThongkekhService', () => {
  let service: ThongkekhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThongkekhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { YeucaudaotaoService } from './yeucaudaotao.service';

describe('YeucaudaotaoService', () => {
  let service: YeucaudaotaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YeucaudaotaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

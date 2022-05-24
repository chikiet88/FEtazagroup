import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeucaudaotaoComponent } from './yeucaudaotao.component';

describe('YeucaudaotaoComponent', () => {
  let component: YeucaudaotaoComponent;
  let fixture: ComponentFixture<YeucaudaotaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YeucaudaotaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YeucaudaotaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

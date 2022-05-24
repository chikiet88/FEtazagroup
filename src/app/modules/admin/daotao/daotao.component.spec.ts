import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaotaoComponent } from './daotao.component';

describe('DaotaoComponent', () => {
  let component: DaotaoComponent;
  let fixture: ComponentFixture<DaotaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaotaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaotaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

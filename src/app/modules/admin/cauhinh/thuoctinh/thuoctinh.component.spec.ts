import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThuoctinhComponent } from './thuoctinh.component';

describe('ThuoctinhComponent', () => {
  let component: ThuoctinhComponent;
  let fixture: ComponentFixture<ThuoctinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThuoctinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThuoctinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

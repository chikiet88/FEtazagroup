import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcauhinhComponent } from './editcauhinh.component';

describe('EditcauhinhComponent', () => {
  let component: EditcauhinhComponent;
  let fixture: ComponentFixture<EditcauhinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcauhinhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcauhinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

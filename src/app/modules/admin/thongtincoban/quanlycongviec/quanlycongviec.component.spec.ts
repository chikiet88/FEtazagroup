import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlycongviecComponent } from './quanlycongviec.component';

describe('QuanlycongviecComponent', () => {
  let component: QuanlycongviecComponent;
  let fixture: ComponentFixture<QuanlycongviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanlycongviecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanlycongviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosotuyendungComponent } from './hosotuyendung.component';

describe('HosotuyendungComponent', () => {
  let component: HosotuyendungComponent;
  let fixture: ComponentFixture<HosotuyendungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HosotuyendungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HosotuyendungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailieunguonComponent } from './tailieunguon.component';

describe('TailieunguonComponent', () => {
  let component: TailieunguonComponent;
  let fixture: ComponentFixture<TailieunguonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailieunguonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TailieunguonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailieunguonListComponent } from './tailieunguon-list.component';

describe('TailieunguonListComponent', () => {
  let component: TailieunguonListComponent;
  let fixture: ComponentFixture<TailieunguonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailieunguonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TailieunguonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

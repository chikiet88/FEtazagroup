import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetuyendungComponent } from './vetuyendung.component';

describe('VetuyendungComponent', () => {
  let component: VetuyendungComponent;
  let fixture: ComponentFixture<VetuyendungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VetuyendungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VetuyendungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

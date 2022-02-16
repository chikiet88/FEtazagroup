import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesComponent } from './ves.component';

describe('VesComponent', () => {
  let component: VesComponent;
  let fixture: ComponentFixture<VesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

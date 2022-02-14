import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichhopComponent } from './lichhop.component';

describe('LichhopComponent', () => {
  let component: LichhopComponent;
  let fixture: ComponentFixture<LichhopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LichhopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LichhopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

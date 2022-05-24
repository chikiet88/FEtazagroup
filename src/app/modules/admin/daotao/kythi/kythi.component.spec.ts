import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KythiComponent } from './kythi.component';

describe('KythiComponent', () => {
  let component: KythiComponent;
  let fixture: ComponentFixture<KythiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KythiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KythiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

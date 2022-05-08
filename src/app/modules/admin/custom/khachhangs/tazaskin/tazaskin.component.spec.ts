import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TazaskinComponent } from './tazaskin.component';

describe('TazaskinComponent', () => {
  let component: TazaskinComponent;
  let fixture: ComponentFixture<TazaskinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TazaskinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TazaskinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

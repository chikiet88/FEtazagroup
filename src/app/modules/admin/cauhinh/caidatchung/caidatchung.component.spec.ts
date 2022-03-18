import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaidatchungComponent } from './caidatchung.component';

describe('CaidatchungComponent', () => {
  let component: CaidatchungComponent;
  let fixture: ComponentFixture<CaidatchungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaidatchungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaidatchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

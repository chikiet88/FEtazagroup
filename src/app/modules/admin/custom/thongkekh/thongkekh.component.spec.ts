import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongkekhComponent } from './thongkekh.component';

describe('ThongkekhComponent', () => {
  let component: ThongkekhComponent;
  let fixture: ComponentFixture<ThongkekhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongkekhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongkekhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

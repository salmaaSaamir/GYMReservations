import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCalenderComponent } from './reservation-calender.component';

describe('ReservationCalenderComponent', () => {
  let component: ReservationCalenderComponent;
  let fixture: ComponentFixture<ReservationCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

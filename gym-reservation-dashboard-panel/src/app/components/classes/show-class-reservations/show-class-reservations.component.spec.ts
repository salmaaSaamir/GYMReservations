import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClassReservationsComponent } from './show-class-reservations.component';

describe('ShowClassReservationsComponent', () => {
  let component: ShowClassReservationsComponent;
  let fixture: ComponentFixture<ShowClassReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowClassReservationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowClassReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

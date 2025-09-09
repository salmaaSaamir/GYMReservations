import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOfferComponent } from './active-offer.component';

describe('ActiveOfferComponent', () => {
  let component: ActiveOfferComponent;
  let fixture: ComponentFixture<ActiveOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveOfferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

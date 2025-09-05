import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySchadualComponent } from './weekly-schadual.component';

describe('WeeklySchadualComponent', () => {
  let component: WeeklySchadualComponent;
  let fixture: ComponentFixture<WeeklySchadualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySchadualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklySchadualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubscriptionsHistoryComponent } from './list-subscriptions-history.component';

describe('ListSubscriptionsHistoryComponent', () => {
  let component: ListSubscriptionsHistoryComponent;
  let fixture: ComponentFixture<ListSubscriptionsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSubscriptionsHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubscriptionsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

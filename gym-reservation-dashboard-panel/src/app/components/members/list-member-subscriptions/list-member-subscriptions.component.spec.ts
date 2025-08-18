import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemberSubscriptionsComponent } from './list-member-subscriptions.component';

describe('ListMemberSubscriptionsComponent', () => {
  let component: ListMemberSubscriptionsComponent;
  let fixture: ComponentFixture<ListMemberSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMemberSubscriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMemberSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

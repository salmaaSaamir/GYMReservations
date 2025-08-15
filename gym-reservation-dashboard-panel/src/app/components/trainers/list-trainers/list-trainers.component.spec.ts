import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrainersComponent } from './list-trainers.component';

describe('ListTrainersComponent', () => {
  let component: ListTrainersComponent;
  let fixture: ComponentFixture<ListTrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTrainersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

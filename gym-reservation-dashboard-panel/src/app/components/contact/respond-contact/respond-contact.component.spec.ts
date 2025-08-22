import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondContactComponent } from './respond-contact.component';

describe('RespondContactComponent', () => {
  let component: RespondContactComponent;
  let fixture: ComponentFixture<RespondContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespondContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespondContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

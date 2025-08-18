import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSchaduleComponent } from './generate-schadule.component';

describe('GenerateSchaduleComponent', () => {
  let component: GenerateSchaduleComponent;
  let fixture: ComponentFixture<GenerateSchaduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateSchaduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSchaduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

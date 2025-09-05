import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutsUsComponent } from './abouts-us.component';

describe('AboutsUsComponent', () => {
  let component: AboutsUsComponent;
  let fixture: ComponentFixture<AboutsUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutsUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutsUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLayputComponent } from './full-layout.component';

describe('FullLayputComponent', () => {
  let component: FullLayputComponent;
  let fixture: ComponentFixture<FullLayputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullLayputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullLayputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

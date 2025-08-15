import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule, // Importing MaterialModule to use Angular Material components

  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {}

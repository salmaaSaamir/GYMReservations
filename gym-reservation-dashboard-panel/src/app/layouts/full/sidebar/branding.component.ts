import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `


    <img
    [routerLink]="['/']"
        src="./assets/images/logos/logo.jpg"
        class="align-middle m-2 rounded-circle"
        alt="logo"
        height="100"
        width="100"
      />
  `,
})
export class BrandingComponent {
  constructor() { }
}

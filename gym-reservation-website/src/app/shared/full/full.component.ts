import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: "app-full",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.css"],
})
export class FullComponent   {
  isSpinner = true;
  userData: any;
  language = "en";

 
}

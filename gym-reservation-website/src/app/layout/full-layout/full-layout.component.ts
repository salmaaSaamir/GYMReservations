import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { AboutsUsComponent } from "../../components/abouts-us/abouts-us.component";
import { WhatWeOfferComponent } from "../../components/what-we-offer/what-we-offer.component";
import { ReservationCalenderComponent } from "../../components/reservation-calender/reservation-calender.component";
import { WeeklySchadualComponent } from "../../components/weekly-schadual/weekly-schadual.component";
import { ContactUsComponent } from "../../components/contact-us/contact-us.component";
import { HomeComponent } from "../../components/home/home.component";

@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,HomeComponent],
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.css'
})
export class FullLayoutComponent {

}

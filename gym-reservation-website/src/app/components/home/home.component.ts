import { Component } from '@angular/core';
import { AboutsUsComponent } from '../abouts-us/abouts-us.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { WhatWeOfferComponent } from '../what-we-offer/what-we-offer.component';
import { ReservationCalenderComponent } from '../reservation-calender/reservation-calender.component';
import { WeeklySchadualComponent } from '../weekly-schadual/weekly-schadual.component';
import { ScrollTopComponent } from "../../shared/scroll-top/scroll-top.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutsUsComponent, ContactUsComponent, WhatWeOfferComponent, ReservationCalenderComponent, WeeklySchadualComponent, ScrollTopComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

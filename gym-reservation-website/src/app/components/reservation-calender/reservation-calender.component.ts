import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // ✨ مهم

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalenderService } from '../../core/services/CalenderService';
import { lastValueFrom } from 'rxjs';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { Reservation } from '../../core/interfaces/Reservation';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-reservation-calender',
  standalone: true,
  imports: [FullCalendarModule, LoaderComponent, CommonModule, FormsModule],
  templateUrl: './reservation-calender.component.html',
  styleUrls: ['./reservation-calender.component.css']
})
export class ReservationCalenderComponent {
  constructor(private CalenderService: CalenderService, private toaster: ToastrService) { }
  calendarPlugins = [dayGridPlugin, interactionPlugin];
  Reservation: Reservation = { Id: 0, ClassId: 0, MemberId: 0 }
  IsSpinner = false
  IsOpenPopup = false;
  CurrentClassId: number = 0;
  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }
  calendarOptions: any = {
  };
  ngOnInit() {


    this.loadCalendar();
  }
async loadCalendar() {
  try {
    this.IsSpinner = true;

    const data: any = await lastValueFrom(
      this.CalenderService.getClassesForMonth()
    );
    

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: data.Data[0].map((c: any) => ({
        id: c.Id,
        title: `${c.Name}\n - ${c.TrainerName}\n(${c.AvailableSeats} seats left)\nTime: ${this.formatTo12Hour(c.Time)}`,
        start: `${c.Date.split("T")[0]}`,
        className: c.AvailableSeats > 0 ? "red-event" : "disabled-event", 
        extendedProps: { availableSeats: c.AvailableSeats } 
      })),
      eventClick: (info: any) => {
        if (info.event.extendedProps.availableSeats > 0) {
          this.OpenReservationPopup(info);
        } else {
          
        }
      },
    };

    this.IsSpinner = false;
  } catch (err) {
    console.error("Error loading classes:", err);
  }
}

  // open reservation popup
  OpenReservationPopup(info: any) {
    
    this.CurrentClassId = info.event.id
    this.Reservation.ClassId = info.event.id
    $('#OpenReservationModal').modal('show');

  }

  closeReservation() {
    this.CurrentClassId = 0
    $('#OpenReservationModal').modal('hide');
  }
  async SaveReservation() {

    try {
      this.IsSpinner = true;
      await this.GetMemberId()
      this.Reservation.ClassId = +this.Reservation.ClassId
      
      const res: any = await lastValueFrom(
        this.CalenderService.saveReservation(this.Reservation)
      );

      if (res.State) {
        this.toaster.success("Reservation saved successfully");
        this.loadCalendar()
        this.closeReservation();
      } else if (res.ErrorMessage) {
        this.toaster.error(res.ErrorMessage);
      }
    } catch (error: any) {
      console.error('Error saving reservation', error);
      this.toaster.error(error.error?.ErrorMessage || "Failed to save reservation");
    } finally {
      this.IsSpinner = false;
    }
  }
  //  Separate function for formatting time
  private formatTo12Hour(time24: string): string {
    if (!time24) return "";

    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 → 12
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
  async GetMemberId() {

    try {
      const res: any = await lastValueFrom(
        this.CalenderService.saveReservation(this.Reservation.MemberId)
      );

      if (res.State) {
        this.Reservation.MemberId = +res.Data[0].Id
      } else if (res.ErrorMessage) {
        this.toaster.error(res.ErrorMessage);
      }
    } catch (error: any) {
      console.error('Error saving reservation', error);
      this.toaster.error(error.error?.ErrorMessage || "Failed to save reservation");
    }
  }

}

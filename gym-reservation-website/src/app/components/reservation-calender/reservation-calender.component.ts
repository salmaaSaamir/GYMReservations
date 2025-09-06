import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // ✨ مهم

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-reservation-calender',
  standalone: true,
  imports: [FullCalendarModule],  // ✨ لازم يكون هنا
  templateUrl: './reservation-calender.component.html',
  styleUrls: ['./reservation-calender.component.css']
})
export class ReservationCalenderComponent {
  calendarPlugins = [dayGridPlugin, interactionPlugin];

  calendarEvents = [
    { title: 'Gym Class', date: '2025-09-06' },
    { title: 'Yoga Session', date: '2025-09-07' }
  ];

  handleDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }
  calendarOptions: any = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  weekends: true,
  events: [
    { title: 'Gym Class', date: '2025-09-06' },
    { title: 'Yoga Session', date: '2025-09-07' }
  ],
  dateClick: this.handleDateClick.bind(this)
};

}

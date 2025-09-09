import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  readonly APIUrl = environment.backApiUrl + 'Classes/';

  constructor(private http: HttpClient) { }
  /** GET: Get  classes schadule */
  getWeeklySchedule(date: Date | string) {
    // Ensure we have a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Format as YYYY-MM-DD
    const dateStr = dateObj.toISOString().split('T')[0];
    return this.http.get(`${this.APIUrl}GetWeeklySchedule?date=${dateStr}`);
  }
}
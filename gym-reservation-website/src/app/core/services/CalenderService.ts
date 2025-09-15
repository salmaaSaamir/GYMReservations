
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  readonly ClassesAPIUrl = environment.backApiUrl + 'Classes/';
    readonly ReservationsAPIUrl = environment.backApiUrl + 'Reservations/';
        readonly MembersAPIUrl = environment.backApiUrl + 'Members/';


  constructor(private http: HttpClient) { }
    /** GET: Get Classes  */

  getClassesForMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ClassesAPIUrl}GetClassesForMonth`);
  }

    /** POST: Add  Reservation */
  saveReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.ReservationsAPIUrl}SaveReservation`, reservation);
  }
  /** GET: Get Member By Id */
  getAllMembers(id:string): Observable<any> {
    return this.http.get(`${this.MembersAPIUrl}GetMmeberById/${id}`);
  }
}
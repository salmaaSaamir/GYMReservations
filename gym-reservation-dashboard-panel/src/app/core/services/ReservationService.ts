import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  readonly APIUrl = environment.backApiUrl + 'Reservations/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Reservations */
  getReservations(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.APIUrl}GetReservations?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Check Class Limit Conflict */
  checkClassAvailability(classId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}checkClassAvailability/${classId}`);
  }

  /** GET: Check Member Reservation */
  checkMemberReservation(classId: number, memberId: number,classDay:string): Observable<any> {
    return this.http.get(`${this.APIUrl}CheckMemberReservation/${classId}/${memberId}/${classDay}`);
  }

  /** POST: Add or update Reservation */
  saveReservation(reservation: any,email:string): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveReservation?email=${email}`, reservation);
  }

  /** DELETE: Delete a Reservation by Id */
  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}DeleteReservation/${id}`);
  }

}
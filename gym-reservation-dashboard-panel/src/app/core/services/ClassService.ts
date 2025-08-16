import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  readonly APIUrl = environment.backApiUrl + 'Classes/';

  constructor(private http: HttpClient) { }

  /** GET: Get all classes */

  getClasses(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetClasses?page=${page}&pageSize=${pageSize}`);
  }
  /** GET: Check if a class exists at specific date/time */
  checkClassConflict(classDay: string, classTime: string): Observable<any> {
    return this.http.get(`${this.APIUrl}CheckClassConflict?classDay=${classDay}&classTime=${classTime}`);
  }

  /** GET: Get all reservations for a specific class */
  getClassReservations(classId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}GetClassReservations/${classId}`);
  }

  /** POST: Add or update a class */
  saveClass(classToSave: any): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveClass`, classToSave);
  }

  /** DELETE: Delete a class by ID */
  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}DeleteClass/${id}`);
  }

    /** POST: Cancel class */
  CancelClass(id: number): Observable<any> {
    return this.http.post(`${this.APIUrl}CancelClass/${id}`,{});
  }
}
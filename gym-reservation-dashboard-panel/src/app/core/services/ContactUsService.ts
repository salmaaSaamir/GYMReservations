import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  readonly APIUrl = environment.backApiUrl + 'ContactUs/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Contacts */
  getContacts(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.APIUrl}GetContacts?page=${page}&pageSize=${pageSize}`);
  }

  /** POST: Add or update Contact */
  saveContact(contact: any): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveContact`, contact);
  }

  /** POST: Send response email to contact */
  responseByEmail(contact: any): Observable<any> {

    return this.http.post(`${this.APIUrl}ResponseByEmail`, contact );
  }

  /** DELETE: Delete a Contact by Id */
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}DeleteContact/${id}`);
  }
}
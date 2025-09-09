import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  readonly APIUrl = environment.backApiUrl + 'ContactUs/';

  constructor(private http: HttpClient) { }
  /** POST: Add or update Contact */
  saveContact(contact: any): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveContact`, contact);
  }
}
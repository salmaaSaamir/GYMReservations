import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  readonly APIUrl = environment.backApiUrl + 'Offers/';

  constructor(private http: HttpClient) { }

  /** GET: Get all offers with pagination */
  getOffers(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.APIUrl}GetOffers?page=${page}&pageSize=${pageSize}`);
  }

  /** POST: Add or update an offer */
  saveOffer(offerToSave: any): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveOffer`, offerToSave);
  }

  /** DELETE: Delete an offer by ID */
  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}DeleteOffer/${id}`);
  }
}
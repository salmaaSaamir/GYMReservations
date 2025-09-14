import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  readonly APIUrl = environment.backApiUrl + 'Offers/';

  constructor(private http: HttpClient) { }

  /** GET: Get Last Offer For Website*/
  GetLastOfferForWebsite(): Observable<any> {
    return this.http.get(`${this.APIUrl}GetLastOfferForWebsite`);
  }

  /** GET: Get Gym Stats*/
  GetGymStatsAsync(): Observable<any> {
    return this.http.get(`${this.APIUrl}GetGymStats`);
  }
}
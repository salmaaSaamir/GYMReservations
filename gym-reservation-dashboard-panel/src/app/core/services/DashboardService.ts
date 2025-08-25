import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DashboardData } from '../interfaces/DashboardData';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly APIUrl = environment.backApiUrl + 'Dashboard/';

  constructor(private http: HttpClient) { }

  /** GET: Get get Dashboard Data */
 getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.APIUrl+'GetDashboardData');
  }

}
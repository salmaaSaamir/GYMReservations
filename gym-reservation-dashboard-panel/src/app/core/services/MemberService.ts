import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  readonly APIUrl = environment.backApiUrl + 'Members/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Members */
  getMembers(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get(`${this.APIUrl}GetMembers?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Get All Members */
  getAllMembers(): Observable<any> {
    return this.http.get(`${this.APIUrl}GetAllMembers`);
  }

  /** GET: Get Member Subscription History */
  getMemberSubscriptionHistory(memberId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}GetSubscriptionHistory/${memberId}`);
  }

  /** GET: Get Active Subscription */
  getActiveSubscription(memberId: number): Observable<any> {
    return this.http.get(`${this.APIUrl}GetActiveSubscription/${memberId}`);
  }

  /** POST: Freeze Subscription */
  freezeSubscription(memberId: number, subscriptionHistoryId: number): Observable<any> {
    return this.http.post(`${this.APIUrl}FreezeSubscription`, {
      memberId,
      subscriptionHistoryId
    });
  }

  /** POST: Add or update Member */
  saveMember(member: any): Observable<any> {
    return this.http.post(`${this.APIUrl}SaveMember`, member);
  }

  /** DELETE: Delete a Member by Id */
  deleteMember(id: number): Observable<any> {
    return this.http.delete(`${this.APIUrl}DeleteMember/${id}`);
  }
}
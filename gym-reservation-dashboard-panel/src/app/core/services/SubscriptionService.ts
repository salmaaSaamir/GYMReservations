import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  readonly APIUrl = environment.backApiUrl + 'Subscriptions/';

  constructor(private http: HttpClient) { }

  /** GET: Get paginated Subscriptions */
  getSubscriptions(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetSubscriptions?page=${page}&pageSize=${pageSize}`);
  }

  /** GET: Get All Subscriptions */
  getAllSubscriptions() {
    return this.http.get(`${this.APIUrl}GetAllSubscriptions`);
  }

  /** POST: Add or update Subscription */
  saveSubscription(subscription: Subscription) {
    return this.http.post(`${this.APIUrl}SaveSubscription`, subscription);
  }

  /** DELETE: Delete a Subscription by Id */
  deleteSubscription(id: number) {
    return this.http.delete(`${this.APIUrl}DeleteSubscription/${id}`);
  }
}
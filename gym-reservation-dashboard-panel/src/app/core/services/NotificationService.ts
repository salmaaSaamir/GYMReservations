import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authService';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { NotificationModel } from '../interfaces/NotificationModel';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private readonly APIUrl = environment.backApiUrl + 'Notifications/';
  
  // Observable for real-time notifications
  private notificationSubject = new Subject<NotificationModel>();
  public notification$ = this.notificationSubject.asObservable();

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  // SignalR Connection Methods
  public startConnection(): Promise<void> {
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.notificationUrl}/notificationHub`, {
      accessTokenFactory: () => localStorage.getItem("GYMReservationToken") || ""
    })
    .withAutomaticReconnect()
    .build();

  return this.hubConnection
    .start()
    .then(() => {
      console.log('✅ Connected to NotificationHub');
      this.setupNotificationListeners();
    })
    .catch(err => {
      console.error('❌ Error connecting to hub', err);
      throw err;
    });
}

  private setupNotificationListeners(): void {
    this.hubConnection.on('ReceiveNotification', (notification: NotificationModel) => {
      console.log('📨 New notification received:', notification);
      this.notificationSubject.next(notification);
    });
  }

  // HTTP API Methods
  /** POST: Get user notifications */
  getNotifications(model: string) {
    return this.http.get(`${this.APIUrl}GetNotifications/${model}`);
  }

  /** GET: Mark notification as read */
  markNotificationAsRead(id: number) {
    return this.http.get(`${this.APIUrl}MarkNotificationAsRead/${id}`);
  }

  /** GET: Delete notification */
  deleteNotification(id: number) {
    return this.http.get(`${this.APIUrl}DeleteNotification/${id}`);
  }

  /** POST: Mark all notifications as read */
  markAllAsRead(model: string) {
    return this.http.get(`${this.APIUrl}MarkAllAsRead/${model}`);
  }

  /** POST: Delete all notifications */
  deleteAllNotifications(model: string) {
    return this.http.get(`${this.APIUrl}DeleteAllNotifications/${model}`);
  }

  // Utility Methods
  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('🛑 Connection stopped'))
        .catch(err => console.error('❌ Error stopping connection', err));
    }
  }

  public getConnectionState(): string {
    return this.hubConnection ? this.hubConnection.state : 'Disconnected';
  }

  public joinClassGroup(classId: string, email: string): void {
  if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
    this.hubConnection.invoke('JoinGroupByClass', classId, email)
      .then(() => console.log(`✅ Joined group for class: ${classId}, email: ${email}`))
      .catch(err => console.error('❌ Error joining group', err));
  } else {
    console.warn('⚠️ Hub not connected yet, delaying joinGroup...');
    this.hubConnection.onreconnected(() => {
      this.hubConnection.invoke('JoinGroupByClass', classId, email)
        .then(() => console.log(`✅ Joined group for class (after reconnect): ${classId}`))
        .catch(err => console.error('❌ Error joining group after reconnect', err));
    });
  }
}

public leaveClassGroup(classId: string, email: string): void {
  if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
    this.hubConnection.invoke('LeaveGroupByClass', classId, email)
      .then(() => console.log(`✅ Left group for class: ${classId}, email: ${email}`))
      .catch(err => console.error('❌ Error leaving group', err));
  }
}

}
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './authService';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;

  constructor(private auth: AuthService) {}

  public startConnection(): void {
    const token = this.auth.getToken(); // your JWT

this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${environment.notificationUrl}/notificationHub`, {
    accessTokenFactory: () => localStorage.getItem("token") || ""
  })
  .withAutomaticReconnect()
  .build();



    this.hubConnection
      .start()
      .then(() => console.log('✅ Connected to NotificationHub'))
      .catch(err => console.error('❌ Error connecting to hub', err));

    this.hubConnection.onclose(() => {
      console.warn('⚠️ Disconnected from hub');
    });
  }

  public joinGroup(email: string) {
    this.hubConnection.invoke('JoinGroupByEmail', email);
  }

  public leaveGroup(email: string) {
    this.hubConnection.invoke('LeaveGroupByEmail', email);
  }
}
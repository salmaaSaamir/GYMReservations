import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './authService';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: signalR.HubConnection;
  private readonly hubUrl = `${environment.notificationUrl}/notificationHub`;

  constructor(private authService: AuthService) {
    this.createConnection();
  }

  private createConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => {
          const token = this.authService.getToken();
          return token || '';
        },
        skipNegotiation: false, // Explicitly set to false
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Add reconnection intervals
      .build();
  }

  public startConnection(): Promise<void> {
    return this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerOnServerEvents();
        return Promise.resolve();
      })
      .catch(err => {
        console.error('Error while starting connection: ', err);
        return Promise.reject(err);
      });
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection.stop();
  }

  private registerOnServerEvents(): void {
    // Register client methods that the server can call
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('Notification received:', message);
      // Handle notification here
    });

    this.hubConnection.on('UserJoined', (userId: string) => {
      console.log('User joined:', userId);
    });

    this.hubConnection.on('UserLeft', (userId: string) => {
      console.log('User left:', userId);
    });

    // Add error handling
    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed', error);
    });

    this.hubConnection.onreconnecting((error) => {
      console.log('SignalR reconnecting', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected', connectionId);
    });
  }

  // Join a group by email
  public joinGroupByEmail(email: string): Promise<void> {
    return this.hubConnection.invoke('JoinGroupByEmail', email)
      .catch(err => {
        console.error('Error joining group:', err);
        throw err;
      });
  }

  // Leave a group by email
  public leaveGroupByEmail(email: string): Promise<void> {
    return this.hubConnection.invoke('LeaveGroupByEmail', email)
      .catch(err => {
        console.error('Error leaving group:', err);
        throw err;
      });
  }

  // Example: Send a notification to a specific group
  public sendNotificationToGroup(email: string, message: string): Promise<void> {
    return this.hubConnection.invoke('SendNotificationToGroup', email, message)
      .catch(err => {
        console.error('Error sending notification:', err);
        throw err;
      });
  }

  // Check connection state
  public getConnectionState(): string {
    return this.hubConnection.state;
  }
}
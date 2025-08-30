import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/core/services/NotificationService';
import { AuthService } from 'src/app/core/services/authService';
import { lastValueFrom, Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { NotificationModel } from 'src/app/core/interfaces/NotificationModel';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: NotificationModel[] = [];
  unreadCount: number = 0;
  isSidebarOpen: boolean = false;
  isBellRinging: boolean = false;

  private notificationSub?: Subscription;
  private userEmail: string = '';
  userData: any
  constructor(
    private notificationService: NotificationService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {
    const token = localStorage.getItem('GYMReservationToken')?.toString() ?? '';
    if (token) {
      this.userData = jwtDecode(token);

    } else {
      this.userData = null;
    }
  }

  async ngOnInit() {
  this.userEmail = this.userData.Email;

  try {
    await this.notificationService.startConnection();
    this.notificationService.joinGroup(this.userEmail);

    this.notificationSub = this.notificationService.notification$.subscribe((n: any) => {
      console.log('Notification received in component:', n);
      this.notifications.unshift(n);
      this.updateUnreadCount();
      this.ringBell();
      this.toastr.info(n.Message, n.Type || 'New Notification');
    });

    await this.loadNotifications();
  } catch (err) {
    console.error('Error starting connection', err);
  }
}


  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
    this.notificationService.leaveGroup(this.userEmail);
    this.notificationService.stopConnection();
  }

  private async loadNotifications() {
    try {
      const res: any = await lastValueFrom(this.notificationService.getNotifications(this.userEmail));
      console.log('Loaded notifications:', res);
      if (res.State) {
        this.notifications = res.Data[0] || [];
        this.updateUnreadCount();
      }

    } catch (err) {
      console.error('Error loading notifications', err);
    }
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.IsRead).length;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.isBellRinging = false;
    }
  }

private ringBell() {
  // Reset the animation first
  this.isBellRinging = false;
  
  // Force a reflow to ensure the class removal is processed
  setTimeout(() => {
    this.isBellRinging = true;
    
    // Stop animation after 3 seconds
    setTimeout(() => {
      this.isBellRinging = false;
    }, 3000);
  }, 10);
}


  async markAsRead(n: NotificationModel) {
    await lastValueFrom(this.notificationService.markNotificationAsRead(n.Id));
    n.IsRead = true;
    this.updateUnreadCount();
  }

  async deleteNotification(n: NotificationModel) {
    await lastValueFrom(this.notificationService.deleteNotification(n.Id));
    this.notifications = this.notifications.filter(x => x.Id !== n.Id);
    this.updateUnreadCount();
  }

  async markAllAsRead() {
    await lastValueFrom(this.notificationService.markAllAsRead(this.userEmail));
    this.notifications.forEach(n => (n.IsRead = true));
    this.updateUnreadCount();
  }

  async deleteAll() {
    await lastValueFrom(this.notificationService.deleteAllNotifications(this.userEmail));
    this.notifications = [];
    this.updateUnreadCount();
  }

  
}

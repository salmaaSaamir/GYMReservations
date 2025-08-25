import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/core/services/authService';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/core/services/NotificationService';
import { UserService } from 'src/app/core/services/UsersService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  UserImage:string = ""
  constructor(private authService: AuthService,private UserService:UserService, private toaster: ToastrService, private notificationService: NotificationService) {
    const token = localStorage.getItem('GYMReservationToken')?.toString() ?? '';
    if (token) {
      this.userData = jwtDecode(token);
      
    } else {
      this.userData = null;
    }
  }
  userData: any;
  isSpinner = false
  async ngOnInit() {
    this.GetUserImage();
     this.notificationService.startConnection();
  }
  async logOut() {

    this.isSpinner = true;

    try {
      const observable = this.authService.logout();


      this.isSpinner = false;
    } catch (error) {
      this.isSpinner = false;
      throw error;
    }
  }
  async GetUserImage() {
    this.isSpinner = true;

    try {
      const observable = this.UserService.GetUserImage(this.userData?.Id);
      var res:any = await lastValueFrom(observable);
      if(res.State){
        this.UserImage = res.Data[0]
      }
      this.isSpinner = false;
    } catch (error) {
      this.isSpinner = false;
      throw error;
    }
  }
}
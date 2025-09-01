import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  Renderer2,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/core/services/authService';
import { lastValueFrom, share } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/core/services/NotificationService';
import { UserService } from 'src/app/core/services/UsersService';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    MatBadgeModule,
    SharedModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  UserImage: string = ""
  language: string = 'en';
  constructor(private authService: AuthService, private UserService: UserService, private translate: TranslateService, private renderer: Renderer2) {
    const token = localStorage.getItem('GYMReservationToken')?.toString() ?? '';
    if (token) {
      this.userData = jwtDecode(token);

    } else {
      this.userData = null;
    }
    if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }
  userData: any;
  isSpinner = false
  async ngOnInit() {
    this.GetUserImage();
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
      var res: any = await lastValueFrom(observable);
      if (res.State) {
        this.UserImage = res.Data[0]
      }
      this.isSpinner = false;
    } catch (error) {
      this.isSpinner = false;
      throw error;
    }
  }

  toggleRtl() {
    this.language = this.language === "ar" ? "en" : "ar";
    const dir = this.language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("language", this.language);
    this.renderer.setAttribute(document.body, "dir", dir);
    this.renderer.setAttribute(document.body, "lang", this.language);
    window.location.reload();
  }
}
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { CoreService } from 'src/app/services/core.service';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';
import { UserService } from 'src/app/core/services/UsersService';
import { jwtDecode } from 'jwt-decode';
const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    HeaderComponent,
    // AppTopstripComponent
  ],
  templateUrl: './full.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class FullComponent implements OnInit {
  navItems: any;
  @ViewChild('leftsidenav')
   sidenav!: MatSidenav;
  resView = false;
  userData: any
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  options = this.settings.getOptions();
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;
  get isOver(): boolean {
    return this.isMobileScreen;
  }
  constructor(
    private settings: CoreService,
    private router: Router,
    private breakpointObserver: BreakpointObserver, public userService: UserService) {
    const token = localStorage.getItem('GYMReservationToken')?.toString() ?? '';
    if (token) {
      this.userData = jwtDecode(token);
    } else {
      this.userData = null;
    }
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
      });
    // Initialize project theme with options
    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });
  }
  async ngOnInit() {
    await this.GetUserMenu()
  }
  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }
  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
    this.resetCollapsedState();
  }
  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }
  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }
  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
  }
async GetUserMenu() {
  try {
    const observable = this.userService.getUserMenus(+this.userData.Id);
    const result: any = await lastValueFrom(observable);
    console.log(result);
    if (result.State) {
      // Transform the API data to match NavItem structure
      this.navItems = [
        { divider: true, navCap: ' ' }, // Add divider if needed
        ...result.Data[0].map((menu: any) => ({
          displayName: menu.DisplayName,
          iconName: menu.IconName,
          route: menu.Route,
        }))
      ];
      console.log(this.navItems);
    }
  } catch (error) {
    console.error('Error loading user menus:', error);
    throw error;
  }
}
trackByItem(index: number, item: any) {
  return item.id || index;
}

}

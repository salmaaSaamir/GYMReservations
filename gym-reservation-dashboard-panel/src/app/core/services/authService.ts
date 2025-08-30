import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly APIUrl = environment.backApiUrl;

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToastrService,
  ) {
    this.loadUserDataFromStorage();
  }

  getToken(): string | null {
    return localStorage.getItem('GYMReservationToken');
  }

  setToken(token: string) {
    localStorage.setItem('GYMReservationToken', token);
    this.startTokenTimer(token);
  }

  private loadUserDataFromStorage() {
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout();
      } else {
        this.userDataSubject.next(token);
        this.startTokenTimer(token);
      }
    }
  }

  updateLoginState(model: any) {
    this.userDataSubject.next(model);
  }

  updateLogoutState() {
    this.userDataSubject.next(null);
  }

  login(model: any) {
    return this.http.post(this.APIUrl + 'Auth/Login', model);
  }

  saveLogOutDate(id: any) {
    return this.http.get(this.APIUrl + 'Auth/Logout/' + id);
  }

  logout() {
    localStorage.clear();
    this.updateLogoutState();
    clearTimeout(this.logoutTimer);
    this.toaster.success('Logout Successfully');
    this.router.navigate(['']);
  }

  // ==============================
  // 🔑 TOKEN HANDLING
  // ==============================

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const expiryDate = decoded.exp * 1000; // convert to ms
    return Date.now() > expiryDate;
  }

  private startTokenTimer(token: string) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expiresAt = decoded.exp * 1000;
    const timeout = expiresAt - Date.now();

    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
        this.toaster.warning('Session expired. Please log in again.');
      }, timeout);
    } else {
      this.logout();
    }
  }
}

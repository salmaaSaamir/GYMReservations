import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

 canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  const token = localStorage.getItem('GYMReservationToken');
  console.log("🚨 Guard Checked — Token:", token);

  if (token) {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log("✅ Token Payload:", tokenPayload);
      return true;
    } catch (e) {
      console.warn("❌ Invalid token:", e);
    }
  }

  console.log("🔒 No token — redirecting to login");
  this.router.navigate(['/authentication/login']);
  return false;
}

}

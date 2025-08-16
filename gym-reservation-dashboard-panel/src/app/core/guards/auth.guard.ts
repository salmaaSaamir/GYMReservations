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
  

  if (token) {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      return true;
    } catch (e) {
      
    }
  }

  
  this.router.navigate(['/authentication/login']);
  return false;
}

}

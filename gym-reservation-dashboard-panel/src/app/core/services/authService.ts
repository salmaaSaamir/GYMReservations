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

  constructor(private http: HttpClient,
    private router: Router,
    private toaster : ToastrService,
  ) {
    this.loadUserDataFromStorage();

  }

  getToken(): string | null {
    return localStorage.getItem('GYMReservationToken'); // Adjust according to how you store your token
  }

  setToken(token : any) {
    
    localStorage.setItem('GYMReservationToken', token); // Adjust according to how you store your token
  }

  private loadUserDataFromStorage() {
    const storedUserData = localStorage.getItem('GYMReservationToken') ?? "";
    if (storedUserData) {
      this.userDataSubject.next(storedUserData);
    }
  }

  updateLoginState(model :any){
    this.userDataSubject.next(model);
  }

  updateLogoutState(){
    this.userDataSubject.next(null);
  }

  login(model: any) {
    return this.http.post(this.APIUrl + 'Auth/Login', model);
  }

  saveLogOutDate(id : any) {
    return this.http.get(this.APIUrl + 'Auth/Logout/' + id);
  }

  logout(){
    localStorage.clear();
    this.updateLogoutState();
    this.toaster.success("Logout Successfully");
    this.router.navigate([''])
  }

}

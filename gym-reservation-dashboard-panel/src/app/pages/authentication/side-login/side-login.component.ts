import { Component, NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/authService';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
    standalone: true,

  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService,private toaster:ToastrService) { }
  isSpinner = false
  form = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.minLength(11)]),
    Password: new FormControl('', [Validators.required]),
    IsRememberMe:new FormControl(false)
  });

  get f() {
    return this.form.controls;
  }

  async login() {
    

    this.isSpinner = true;

    try {
      const observable = this.authService.login(this.form.value);
      const result: any = await lastValueFrom(observable);
      
      window.scrollTo(0, 0);
      if (result.State) {
       this.toaster.success(result.SuccessMessage)
       localStorage.setItem("GYMReservationToken" ,result.token)
       this.isSpinner = false
       this.router.navigate(['/dashboard'])
      }else{
        this.toaster.error(result.ErrorMessage + " ,Check Your Data!")
      }

      this.isSpinner = false;
    } catch (error) {
      this.isSpinner = false;
      throw error;
    }
  }
}

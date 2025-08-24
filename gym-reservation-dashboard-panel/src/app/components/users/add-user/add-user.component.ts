import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/UsersService';
declare var $: any;

@Component({
  selector: 'app-add-user',
  styleUrls: ['./add-user.component.scss'],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit {
  @Input() user?: User = new User();
  @Output() closeAddUserModal = new EventEmitter();
  isSpinner = false;
  form: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      Id: [0],
      FName: ['', [Validators.required, Validators.minLength(2)]],
      LName: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ImageUrl: [''],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);

      // لو edit نلغي شرط الباسورد
      if (this.user.Id > 0) {
        this.form.get('Password')?.clearValidators();
        this.form.get('Password')?.updateValueAndValidity();
      }
    }
    $('#addUserModal').modal('show');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ✅ هنا التحويل لـ base64
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({
          ImageUrl: reader.result as string
        });
        this.form.get('ImageUrl')?.markAsTouched(); // عشان التحقق يشتغل
      };
      reader.readAsDataURL(file);
    }
  }

  async save() {
    if (this.form.invalid) return;

    try {
      const res: any = await lastValueFrom(this.userService.saveUser(this.form.value));

      if (res.State) {
        this.toaster.success("Saved successfully");
        this.cancel()
      }
    } catch (error) {
      console.error('Error saving user', error);
    }
  }

  cancel() {
    $('#addUserModal').modal('hide');
    this.closeAddUserModal.emit();
  }
}

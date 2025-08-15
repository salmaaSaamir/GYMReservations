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
  showPassword: boolean = false; // Property to toggle password visibility

  constructor(private fb: FormBuilder,private toaster: ToastrService, private userService: UserService) {
    this.form = this.fb.group({
      Id: [0],
      FName: ['', [Validators.required, Validators.minLength(2)]],
      LName: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ImageUrl: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);

      // If editing, remove password requirement
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

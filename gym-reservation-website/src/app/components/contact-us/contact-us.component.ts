import { Component } from '@angular/core';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { CommonModule } from '@angular/common';
import { ContactUs } from '../../core/interfaces/ContactUs';
import { lastValueFrom } from 'rxjs';
import { ContactUsService } from '../../core/services/ContactUsService';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule], // ✅ لازم تضيف FormsModule
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  constructor(
    private contactUsService: ContactUsService,
    private toaster: ToastrService
  ) { }

  contactUs: ContactUs = { Id: 0, Message: '', Email: '' }; // ✅ initialize
  IsSpinner = false;

  async save() {
    try {
      this.IsSpinner = true;

      const res: any = await lastValueFrom(
        this.contactUsService.saveContact(this.contactUs)
      );

      if (res.State) {
        this.toaster.success("Message sent successfully");
        this.contactUs = { Id: 0, Message: '', Email: '' }; // ✅ reset form
      } else if (res.ErrorMessage) {
        this.toaster.error(res.ErrorMessage);
      }
    } catch (error: any) {
      console.error('Error sending message', error);
      this.toaster.error(error.error?.ErrorMessage || "Failed to send message");
    } finally {
      this.IsSpinner = false;
    }
  }
}

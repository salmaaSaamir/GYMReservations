import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ContactUs } from 'src/app/core/models/ContactUs';
import { ContactUsService } from 'src/app/core/services/ContactUsService';

declare var $: any;

@Component({
  selector: 'app-respond-contact',
  templateUrl: './respond-contact.component.html',
  styleUrls: ['./respond-contact.component.css']
})
export class RespondContactComponent implements OnInit {
  @Input() contactUs: ContactUs = new ContactUs();
  @Output() closeAddContactUsModal = new EventEmitter();
  isSpinner = false;

  constructor(
    private toaster: ToastrService,
    private contactUsService: ContactUsService
  ) {

  }

  ngOnInit() {

    $('#addContactUsModal').modal('show');
  }

  async save() {

    try {
      this.isSpinner = true;
      // Call the responseByEmail service method
        
      const res: any = await lastValueFrom(
        this.contactUsService.responseByEmail(this.contactUs)
      );

      if (res.State) {
        this.toaster.success("Response sent successfully");
        this.cancel();
      } else if (res.ErrorMessage) {
        this.toaster.error(res.ErrorMessage);
      }
    } catch (error: any) {
      console.error('Error sending response', error);
      this.toaster.error(error.error?.ErrorMessage || "Failed to send response");
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addContactUsModal').modal('hide');
    this.closeAddContactUsModal.emit();
  }
}
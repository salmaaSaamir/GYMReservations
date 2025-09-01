import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Subscription } from 'src/app/core/models/Subscription';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';
declare var $: any;

@Component({
  selector: 'app-add-subscription',
  templateUrl: './add-subscription.component.html',
  styleUrls: ['./add-subscription.component.css']
})
export class AddSubscriptionComponent implements OnInit {
  @Input() subscription: any
  @Output() closeAddSubscriptionModal = new EventEmitter();
  isSpinner = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService, 
    private subscriptionService: SubscriptionService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Description: [''],
      Price: [0, [Validators.required, Validators.min(0)]],
      IsActive: [true],
      FreezeDays: [null],
      InvetaionsNo: [0, [Validators.required, Validators.min(0)]],
      MonthsNo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    
    if (this.subscription) {
      this.form.patchValue(this.subscription);
    }
    $('#addSubscriptionModal').modal('show');
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isSpinner = true;
      const subscriptionData = this.form.value;
      const res: any = await lastValueFrom(
        this.subscriptionService.saveSubscription(subscriptionData)
      );
      
      if (res.State) {
        this.toaster.success("Subscription saved successfully");
        this.cancel();
      }
    } catch (error) {
      console.error('Error saving subscription', error);
      this.toaster.error("Failed to save subscription");
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addSubscriptionModal').modal('hide');
    this.closeAddSubscriptionModal.emit();
  }
}
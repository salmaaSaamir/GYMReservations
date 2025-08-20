import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Member } from 'src/app/core/models/Member';
import { Subscription } from 'src/app/core/models/Subscription';
import { MemberService } from 'src/app/core/services/MemberService';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';

declare var $: any;

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  @Input() member?: Member;
  @Input() lastIDCard: string = "";
  @Output() closeAddMemberModal = new EventEmitter();
  isSpinner = false;
  form: FormGroup;
  subscriptions: Subscription[] = []; // Assuming you have a list of subscriptions to choose from
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private memberService: MemberService
    ,
    private subscriptionService: SubscriptionService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      IDCard: [{ value: '', disabled: true }],  // Correct way to initialize disabled
      CurrentSubscriptionId: [0]
    });
  }

  ngOnInit() {
    if (this.member && this.member.Id) {
      // Editing existing member
      this.form.patchValue(this.member);
    } else {
      // Adding new member - generate ID Card
      this.generateIDCard();
    }
    this.getAllSubscriptions()
    $('#addMemberModal').modal('show');
  }
  async getAllSubscriptions() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.subscriptionService.getAllSubscriptions()
      );

      if (res.State) {
        this.subscriptions = res.Data[0];


      }
    } catch (error) {
      console.error('Error loading Members', error);
      this.toaster.error('Failed to load Members');
    } finally {
      this.isSpinner = false;
    }
  }
  generateIDCard() {
    let nextNumber = 1;
    if (this.lastIDCard) {
      const lastNumber = parseInt(this.lastIDCard, 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    this.form.patchValue({
      IDCard: nextNumber.toString().padStart(4, '0')
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isSpinner = true;
      const memberData = this.form.getRawValue(); // Gets ALL values including disabled

      const res: any = await lastValueFrom(this.memberService.saveMember(memberData));

      if (res.State) {
        this.toaster.success("Saved successfully");
        this.cancel();
      } else {
        this.toaster.error(res.ErrorMessage || "Failed to save member");
      }
    } catch (error) {
      console.error('Error saving member', error);
      this.toaster.error("Failed to save member");
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addMemberModal').modal('hide');
    this.closeAddMemberModal.emit();
  }
}
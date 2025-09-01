import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Member } from 'src/app/core/models/Member';
import { Subscription } from 'src/app/core/models/Subscription';
import { Offer } from 'src/app/core/models/Offer';
import { MemberService } from 'src/app/core/services/MemberService';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';
import { TranslateService } from '@ngx-translate/core';

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
  subscriptions: any[] = []; // Changed to any[] to include ApplicableOffers
  language: string = 'en';
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private memberService: MemberService,
    private subscriptionService: SubscriptionService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      IDCard: [{ value: '', disabled: true }],
      CurrentSubscriptionId: [0, Validators.required]
    });
     if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }

  async ngOnInit() {
    if (this.member && this.member.Id) {
      // Editing existing member
      this.form.patchValue(this.member);
    } else {
      // Adding new member - generate ID Card
      this.generateIDCard();
    }
    await this.getAllSubscriptions();
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
      console.error('Error loading subscriptions', error);
      this.toaster.error('Failed to load subscriptions');
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

  // Check if a subscription has an active offer
  hasActiveOffer(subscription: any): boolean {
    return subscription.ApplicableOffers && 
           subscription.ApplicableOffers.length > 0 && 
           this.getApplicableOffer(subscription.ApplicableOffers) !== null;
  }

  // Get the applicable offer (specific takes precedence over general)
  getApplicableOffer(offers: Offer[]): Offer | null {
    if (!offers || offers.length === 0) return null;
    
    // Filter active offers
    const activeOffers = offers.filter(offer => 
      offer.IsActive && 
      new Date(offer.StartDate) <= new Date() && 
      new Date(offer.EndDate) >= new Date()
    );
    
    if (activeOffers.length === 0) return null;
    
    // First, try to find a specific offer
    const specificOffer = activeOffers.find(offer => !offer.IsGeneralOffer);
    if (specificOffer) {
      return specificOffer;
    }
    
    // If no specific offer, return the first general offer
    return activeOffers.find(offer => offer.IsGeneralOffer) || null;
  }

  // Generate tooltip text for offers
  getOfferTooltip(offer: Offer | null): string {
    if (!offer) return '';
    
    const offerType = offer.IsGeneralOffer ? 'General Offer' : 'Specific Offer';
    const startDate = new Date(offer.StartDate).toLocaleDateString();
    const endDate = new Date(offer.EndDate).toLocaleDateString();
    
    return `${offerType}: ${offer.Value}% off (${startDate} - ${endDate})`;
  }

  // Calculate discounted price
  calculateDiscountedPrice(originalPrice: number, offer: Offer | null): number {
    if (!offer) return originalPrice;
    
    const discountAmount = (originalPrice * offer.Value) / 100;
    return originalPrice - discountAmount;
  }
}
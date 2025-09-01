import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Offer } from 'src/app/core/models/Offer';
import { Subscription } from 'src/app/core/models/Subscription';
import { OfferService } from 'src/app/core/services/OfferService';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';

declare var $: any;

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.css']
})
export class AddOfferComponent implements OnInit {
  @Input() offer?: Offer = new Offer();
  @Output() closeAddOfferModal = new EventEmitter();
  subscriptions: any[] = [];
  isSpinner = false;
  form: FormGroup;
  conflictError: string | null = null;
language: string = 'en';  
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private offerService: OfferService,
    private subscriptionService: SubscriptionService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Value: [0, [Validators.required, Validators.min(0)]],
      SubscriptionId: [null],
      IsGeneralOffer: [false],
      IsActive: [true],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]
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
    await this.getSubscriptionData();
    if (this.offer && this.offer.Id !== 0) {
      this.form.patchValue(this.offer);
      
      // Convert string dates to Date objects if needed
      if (typeof this.offer.StartDate === 'string') {
        this.form.patchValue({
          StartDate: this.formatDateForInput(this.offer.StartDate),
          EndDate: this.formatDateForInput(this.offer.EndDate)
        });
      }
    }
    $('#addOfferModal').modal('show');
  }

  private formatDateForInput(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  async getSubscriptionData() {
    try {
      const res: any = await lastValueFrom(this.subscriptionService.getAllSubscriptions());
      if (res.State) {
        
        this.subscriptions = res.Data[0];
      }
    } catch (error) {
      console.error('Error getting subscriptions', error);
      this.toaster.error('Failed to load subscriptions');
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isSpinner = true;
      const offerData = this.form.value as Offer;
      
      // If it's a general offer, ensure SubscriptionId is null
      if (offerData.IsGeneralOffer) {
        offerData.SubscriptionId = null;
      }

      const res: any = await lastValueFrom(this.offerService.saveOffer(offerData));

      if (res.State) {
        this.toaster.success("Offer saved successfully");
        this.cancel();
      }
    } catch (error: any) {
      console.error('Error saving offer', error);
      if (error.error && error.error.Message) {
        this.conflictError = error.error.Message;
      } else {
        this.toaster.error("Failed to save offer");
      }
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addOfferModal').modal('hide');
    this.closeAddOfferModal.emit();
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
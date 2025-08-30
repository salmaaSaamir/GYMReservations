import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Subscription } from 'src/app/core/models/Subscription';
import { Offer } from 'src/app/core/models/Offer';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-subscription',
  templateUrl: './list-subscription.component.html',
  styleUrls: ['./list-subscription.component.css']
})
export class ListSubscriptionComponent implements OnInit {
  subscriptionsWithOffers: any[] = [];
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isSpinner = true;
  totalCount = 0;
  isAddSubscription = false;
  selectedSubscription?: Subscription;
  filteredSubscriptions: any[] = []; 
  searchTerm: string = '';
  constructor(
    private subscriptionService: SubscriptionService, 
    private toaster: ToastrService
  ) { }

  async ngOnInit() {
    await this.loadSubscriptions();
  }

  async loadSubscriptions() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.subscriptionService.getSubscriptions(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.subscriptionsWithOffers = res.Data[3];
        this.filteredSubscriptions = [...this.subscriptionsWithOffers]; // Initialize filtered list
      }
    } catch (error) {
      console.error('Error loading subscriptions', error);
      this.toaster.error('Failed to load subscriptions');
    } finally {
      this.isSpinner = false;
    }
  }

  // Get the applicable offer (specific takes precedence over general)
  getApplicableOffer(offers: Offer[]): Offer | null {
    if (!offers || offers.length === 0) return null;
    
    // First, try to find a specific offer
    const specificOffer = offers.find(offer => !offer.IsGeneralOffer);
    if (specificOffer) {
      return specificOffer;
    }
    
    // If no specific offer, return the first general offer (or you could return the best general offer)
    const generalOffer = offers.find(offer => offer.IsGeneralOffer);
    return generalOffer || null;
  }

  // Calculate discounted price
  calculateDiscountedPrice(originalPrice: number, offer: Offer | null): number {
    if (!offer) return originalPrice;
    
    const discountAmount = (originalPrice * offer.Value) / 100;
    return originalPrice - discountAmount;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSubscriptions();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadSubscriptions();
  }

  openAddSubscription(subscriptionWithOffers?: any) {
    console.log('Editing subscription:', subscriptionWithOffers);
    this.selectedSubscription = subscriptionWithOffers;
    this.isAddSubscription = true;
  }

  async closeAddSubscriptionModal() {
    this.isAddSubscription = false;
    await this.loadSubscriptions();
  }

  async deleteSubscription(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This subscription will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.subscriptionService.deleteSubscription(id));
        await this.loadSubscriptions();
        this.toaster.success('Subscription deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete subscription');
      }
    }
  }

  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
  // ✅ Smart Search
  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredSubscriptions = [...this.subscriptionsWithOffers];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredSubscriptions = this.subscriptionsWithOffers.filter(sub => {
      const s = sub.Subscription;
      const offer = this.getApplicableOffer(sub.ApplicableOffers);

      return (
        s.Id?.toString().includes(searchLower) ||
        s.Name?.toLowerCase().includes(searchLower) ||
        s.Description?.toLowerCase().includes(searchLower) ||
        s.Price?.toString().includes(searchLower) ||
        (s.IsActive ? 'active' : 'inactive').includes(searchLower) ||
        (offer && offer.Value.toString().includes(searchLower))
      );
    });
  }
}
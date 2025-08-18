import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Subscription } from 'src/app/core/models/Subscription';
import { SubscriptionService } from 'src/app/core/services/SubscriptionService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-subscription',
  templateUrl: './list-subscription.component.html',
  styleUrls: ['./list-subscription.component.css']
})
export class ListSubscriptionComponent implements OnInit {
  subscriptions: Subscription[] = [];
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isSpinner = true;
  totalCount = 0;
  isAddSubscription = false;
  selectedSubscription?: Subscription;

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
        this.subscriptions = res.Data[3];
      }
    } catch (error) {
      console.error('Error loading subscriptions', error);
      this.toaster.error('Failed to load subscriptions');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSubscriptions();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadSubscriptions();
  }

  openAddSubscription(subscription?: Subscription) {
    this.selectedSubscription = subscription;
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
}
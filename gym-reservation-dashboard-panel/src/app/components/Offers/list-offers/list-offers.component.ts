import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Offer } from 'src/app/core/models/Offer';
import { OfferService } from 'src/app/core/services/OfferService';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {

  offers: Offer[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50,100,200,1000];
  isSpinner = true;
  totalCount = 0;
  isAddoffer = false;
  selectedoffer?: Offer;
  isAddofferMenu = false;
  selectedofferId = 0;
  selectedofferName = '';
  searchTerm: string = '';
  filteredoffers: Offer[] = [];
  language:string="en"
  isShowofferReservation = false;
  constructor(private offerService: OfferService, private toaster: ToastrService,private translate:TranslateService) {
        if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
   }

  async ngOnInit() {
    await this.loadoffers();
  }

  async loadoffers() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.offerService.getOffers(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        // Ensure currentPage is within valid range
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.offers = res.Data[3];
        this.filteredoffers = [...this.offers]; // نسخة لعرضها

      }
    } catch (error) {
      console.error('Error loading offers', error);
      this.toaster.error('Failed to load offers');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadoffers();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadoffers();
  }

  openAddoffer(offer?: Offer) {
    this.selectedoffer = offer;
    this.isAddoffer = true;
  }

  async closeAddofferModal() {
    this.isAddoffer = false;
    await this.loadoffers();
  }
  async deleteoffer(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This offer will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.offerService.deleteOffer(id));
        await this.loadoffers();
        this.toaster.success('offer deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete offer');
      }
    }
  }
  // In your component offer
  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  formatTo12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredoffers = [...this.offers];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredoffers = this.offers.filter(u => {
      const typeText = u.IsGeneralOffer ? 'general' : 'specific';
      const statusText = u.IsActive ? 'active' : 'inactive';

      return (
        u.Value?.toString().toLowerCase().includes(searchLower) ||
        u.Id?.toString().includes(searchLower) ||
        u.SubscriptionId?.toString().includes(searchLower) ||
        (u.StartDate && new Date(u.StartDate).toLocaleDateString().toLowerCase().includes(searchLower)) ||
        (u.EndDate && new Date(u.EndDate).toLocaleDateString().toLowerCase().includes(searchLower)) ||
        typeText.includes(searchLower) ||    // ✅ General / Specific
        statusText.includes(searchLower)     // ✅ Active / Inactive
      );
    });
  }


}

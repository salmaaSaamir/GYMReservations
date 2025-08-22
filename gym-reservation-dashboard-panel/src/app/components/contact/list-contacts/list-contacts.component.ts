import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ContactUs } from 'src/app/core/models/ContactUs';
import { ContactUsService } from 'src/app/core/services/ContactUsService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.css']
})
export class ListContactsComponent implements OnInit {

 ContactUss: ContactUs[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isSpinner = true;
  totalCount = 0;
  isAddContactUs = false;
  selectedContactUs: ContactUs = new ContactUs();
  selectedContactUsId = 0;
  constructor(private ContactUsService: ContactUsService, private toaster: ToastrService) { }

  async ngOnInit() {
    await this.loadContactUss();
  }

  async loadContactUss() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.ContactUsService.getContacts(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        // Ensure currentPage is within valid range
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.ContactUss = res.Data[3];

      }
    } catch (error) {
      console.error('Error loading ContactUss', error);
      this.toaster.error('Failed to load ContactUss');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadContactUss();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadContactUss();
  }

  openAddContactUs(ContactUs: ContactUs) {
    this.selectedContactUs = ContactUs;
    this.isAddContactUs = true;
  }
  async closeAddContactUsModal() {
    this.isAddContactUs = false;
    await this.loadContactUss();
  }

  async deleteContactUs(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This ContactUs will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.ContactUsService.deleteContact(id));
        await this.loadContactUss();
        this.toaster.success('ContactUs deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete ContactUs');
      }
    }
  }
  // In your component class
  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
}

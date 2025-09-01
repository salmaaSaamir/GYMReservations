import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  filteredContactUss: ContactUs[] = [];
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100, 200, 1000];
  isSpinner = true;
  totalCount = 0;
  isAddContactUs = false;
  selectedContactUs: ContactUs = new ContactUs();
  selectedContactUsId = 0;
  searchTerm: string = '';
  statusFilter: string = 'all';
  language: string = 'en';
  constructor(private ContactUsService: ContactUsService, private toaster: ToastrService, private translate: TranslateService
  ) {
     if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
   }
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
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.ContactUss = res.Data[3].map((contact: ContactUs) => ({
          ...contact,
          showFullMessage: false
        }));
        this.filterContactUss();
      }
    } catch (error) {
      console.error('Error loading contact messages', error);
      this.toaster.error('Failed to load contact messages');
    } finally {
      this.isSpinner = false;
    }
  }
  filterContactUss() {
    this.filteredContactUss = this.ContactUss.filter(contact => {
      // Search term filter
      const matchesSearch = this.searchTerm === '' ||
        contact.Message?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.Email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      // Status filter
      const matchesStatus = this.statusFilter === 'all' ||
        (this.statusFilter === 'pending' && contact.Response === '') ||
        (this.statusFilter === 'responded' && contact.Response !== '');
      return matchesSearch && matchesStatus;
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadContactUss();
  }
  onPageSizeChange() {
    this.currentPage = 1;
    this.loadContactUss();
  }
  openAddContactUs(contact: ContactUs) {
    this.selectedContactUs = contact;
    this.isAddContactUs = true;
  }
  async closeAddContactUsModal() {
    this.isAddContactUs = false;
    await this.loadContactUss();
  }
  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
}
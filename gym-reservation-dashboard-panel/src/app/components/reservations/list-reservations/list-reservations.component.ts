import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Reservation } from 'src/app/core/models/Reservation';
import { ReservationService } from 'src/app/core/services/ReservationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-reservations',
  templateUrl: './list-reservations.component.html',
  styleUrls: ['./list-reservations.component.css']
})
export class ListReservationsComponent implements OnInit {
  Reservations: any[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100, 200, 1000];
  isSpinner = true;
  totalCount = 0;
  isAddReservation = false;
  selectedReservation?: Reservation;
  isAddReservationMenu = false;
  selectedReservationId = 0;
  filteredReservations: any[] = [];
  searchTerm: string = '';
  language: string = "en"
  constructor(private ReservationService: ReservationService, private toaster: ToastrService, private translate: TranslateService) {
    if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }

  async ngOnInit() {
    await this.loadReservations();
  }

  async loadReservations() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.ReservationService.getReservations(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        // Ensure currentPage is within valid range
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.Reservations = res.Data[3];
        this.filteredReservations = [...this.Reservations];
      }
    } catch (error) {
      console.error('Error loading Reservations', error);
      this.toaster.error('Failed to load Reservations');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadReservations();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadReservations();
  }

  openAddReservation(Reservation?: Reservation) {
    this.selectedReservation = Reservation;
    this.isAddReservation = true;
  }

  openAddReservationMenu(Id: number) {
    this.selectedReservationId = Id;
    this.isAddReservationMenu = true;
  }

  async closeAddReservationModal() {
    this.isAddReservation = false;
    await this.loadReservations();
  }
  async deleteReservation(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Reservation will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.ReservationService.deleteReservation(id));
        await this.loadReservations();
        this.toaster.success('Reservation deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete Reservation');
      }
    }
  }

  // In your component Reservation
  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredReservations = [...this.Reservations];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredReservations = this.Reservations.filter(u =>
      u.Id?.toString().includes(searchLower) ||
      u.ClassName?.toLowerCase().includes(searchLower) ||
      u.MemberID?.toString().includes(searchLower) ||
      u.MemberName?.toLowerCase().includes(searchLower) ||
      u.TrainerName?.toLowerCase().includes(searchLower)
    );
  }

}

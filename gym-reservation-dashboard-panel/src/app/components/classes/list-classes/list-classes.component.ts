import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { GymClass } from 'src/app/core/models/GymClass';
import { ClassService } from 'src/app/core/services/ClassService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.css']
})
export class ListClassesComponent implements OnInit {

  Classs: GymClass[] = [];
  filteredClasses: GymClass[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  isSpinner = true;
  totalCount = 0;
  isAddClass = false;
  selectedClass?: GymClass;
  isAddClassMenu = false;
  selectedClassId = 0;
  selectedClassName = '';
  searchTerm = "";
  searchTimeout: any;
  isShowClassReservation = false;
  userData: any
  constructor(private ClassService: ClassService, private toaster: ToastrService) {
    const token = localStorage.getItem('GYMReservationToken')?.toString() ?? '';
    if (token) {
      this.userData = jwtDecode(token);

    } else {
      this.userData = null;
    }
  }

  async ngOnInit() {
    await this.loadClasss();
  }

  async loadClasss() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.ClassService.getClasses(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        // Ensure currentPage is within valid range
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.Classs = res.Data[3];
        this.filteredClasses = [...this.Classs]; // Initialize filtered Classs
      }
    } catch (error) {
      console.error('Error loading Classs', error);
      this.toaster.error('Failed to load Classs');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadClasss();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadClasss();
  }

  openAddClass(Class?: GymClass) {
    this.selectedClass = Class;
    this.isAddClass = true;
  }

  openAddClassMenu(Id: number) {
    this.selectedClassId = Id;
    this.isAddClassMenu = true;
  }

  async closeAddClassModal() {
    this.isAddClass = false;
    await this.loadClasss();
  }

  openShowReservationModal(data: any) {
    this.isShowClassReservation = true;
    this.selectedClassId = data.Id
    this.selectedClassName = data.Name
  }
  closeshowReservationModal() {
    this.isShowClassReservation = false;
  }
  async deleteClass(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Class will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.ClassService.deleteClass(id));
        await this.loadClasss();
        this.toaster.success('Class deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete Class');
      }
    }
  }

  // cancel class
  async CancelClass(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Class will be  Cancelled.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.ClassService.CancelClass(id, this.userData.Email));
        await this.loadClasss();
        this.toaster.success('Class cancelled successfully');
      } catch (error) {
        this.toaster.error('Failed to cancel Class');
      }
    }
  }
  // In your component class
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

  // schedule image
  isGenerateWeeklySchedule = false;
  generateWeeklySchedule() {
    this.isGenerateWeeklySchedule = true;
  }
  closeGenerateModal() {
    this.isGenerateWeeklySchedule = false;
  }
  onSearch() {

    if (!this.searchTerm.trim()) {
      this.filteredClasses = [...this.Classs];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredClasses = this.Classs.filter(Class =>
      Class.Name?.toLowerCase().includes(searchLower) ||
      Class.ClassDay.toLowerCase().includes(searchLower) ||
      Class.ClassTime?.toLowerCase().includes(searchLower) ||
      Class.Id?.toString().includes(searchLower)
    );

  }
}

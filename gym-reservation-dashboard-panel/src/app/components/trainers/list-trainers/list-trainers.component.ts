import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Trainer } from 'src/app/core/models/Trainer';
import { TrainerService } from 'src/app/core/services/TrainerService';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-trainers',
  templateUrl: './list-trainers.component.html',
  styleUrls: ['./list-trainers.component.css']
})
export class ListTrainersComponent implements OnInit {

  Trainers: Trainer[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50,100,200,1000];
  isSpinner = true;
  totalCount = 0;
  isAddTrainer = false;
  selectedTrainer?: Trainer;
  selectedTrainerId = 0;
  LastIDCard = ""

  filteredTrainers: Trainer[] = [];
  searchTerm: string = '';
  language:string="en"
  constructor(private TrainerService: TrainerService, private toaster: ToastrService,private translate:TranslateService) { 
        if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }

  async ngOnInit() {
    await this.loadTrainers();
  }

  async loadTrainers() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.TrainerService.getTrainers(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        // Ensure currentPage is within valid range
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.Trainers = res.Data[3];
        this.LastIDCard = res.Data[4];
        this.filteredTrainers = [...this.Trainers];

      }
    } catch (error) {
      console.error('Error loading Trainers', error);
      this.toaster.error('Failed to load Trainers');
    } finally {
      this.isSpinner = false;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTrainers();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadTrainers();
  }

  openAddTrainer(Trainer?: Trainer) {
    this.selectedTrainer = Trainer;
    this.isAddTrainer = true;
  }
  async closeAddTrainerModal() {
    this.isAddTrainer = false;
    await this.loadTrainers();
  }

  async deleteTrainer(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Trainer will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.TrainerService.deleteTrainer(id));
        await this.loadTrainers();
        this.toaster.success('Trainer deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete Trainer');
      }
    }
  }
  // In your component class
  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  } // ✅ Smart Search
  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredTrainers = [...this.Trainers];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredTrainers = this.Trainers.filter(trainer =>
      trainer.Id.toString().includes(searchLower) ||
      trainer.Name?.toLowerCase().includes(searchLower) ||
      trainer.Phone?.toLowerCase().includes(searchLower) ||
      trainer.Email?.toLowerCase().includes(searchLower)
    );
  }
}

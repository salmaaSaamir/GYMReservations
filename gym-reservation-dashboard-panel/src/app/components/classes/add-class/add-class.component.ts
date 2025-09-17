import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { GymClass } from 'src/app/core/models/GymClass';
import { Trainer } from 'src/app/core/models/Trainer';
import { ClassService } from 'src/app/core/services/ClassService';
import { TrainerService } from 'src/app/core/services/TrainerService';

declare var $: any;

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {
  @Input() class?: GymClass = new GymClass();
  @Output() closeAddClassModal = new EventEmitter();
  trainers: Trainer[] = [];
  isSpinner = false;
  form: FormGroup;
  conflictError: string | null = null;
  language: string = 'en';
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private classService: ClassService,
    private trainerService: TrainerService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      ClassDay: ['', Validators.required],
      ClassTime: ['', Validators.required],
      ClassLimit: [0],
      TrainerId: [null, Validators.required],
      IsCancelled: [false]
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
    await this.getTrainerData();
    if (this.class) {
      this.form.patchValue(this.class);
    }
    $('#addClassModal').modal('show');
  }

  async getTrainerData() {
    try {
      const res: any = await lastValueFrom(this.trainerService.getAllTrainers());
      if (res.State) {
        this.trainers = res.Data[0];
      }
    } catch (error) {
      console.error('Error getting trainers', error);
      this.toaster.error('Failed to load trainers');
    }
  }

  async checkConflict() {

    if (!this.form.value.ClassDay || !this.form.value.ClassTime) {
      this.conflictError = null;
      return;
    }

    try {
      const res = await lastValueFrom(
        this.classService.checkClassConflict(this.form.value.ClassDay, this.form.value.ClassTime.toString())
      );
      if (res.State && res.Data[0]) {
        this.conflictError = 'There is already a class scheduled at this time. Please choose a different time.';
      } else {
        this.conflictError = null;
      }
    } catch (error) {
      console.error('Error checking conflict', error);
      this.conflictError = 'Error checking for schedule conflicts. Please try again.';
    }
  }

  async save() {
    if (this.form.invalid || this.conflictError) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isSpinner = true;
      const classData = this.form.value as GymClass;
      const res: any = await lastValueFrom(this.classService.saveClass(classData));

      if (res.State) {
        this.toaster.success("Class saved successfully");
        this.cancel();
      }
    } catch (error) {
      console.error('Error saving class', error);
      this.toaster.error("Failed to save class");
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addClassModal').modal('hide');
    this.closeAddClassModal.emit();
  }
}
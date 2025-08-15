import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Trainer } from 'src/app/core/models/Trainer';
import { TrainerService } from 'src/app/core/services/TrainerService';
declare var $: any;

@Component({
  selector: 'app-add-trainer',
  templateUrl: './add-trainer.component.html',
  styleUrls: ['./add-trainer.component.css']
})
export class AddTrainerComponent implements OnInit {
  @Input() trainer?: Trainer = new Trainer();
  @Input() lastIDCard: string = "";
  @Output() closeAddTrainerModal = new EventEmitter();
  isSpinner = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService, 
    private trainerService: TrainerService
  ) {
    this.form = this.fb.group({
      Id: [0],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
  IDCard: [{value: '', disabled: true}],  // Correct way to initialize disabled
      IsGeneralTrainer: [false]
    });
  }

  ngOnInit() {
    this.generateIDCard();
    if (this.trainer) {
      this.form.patchValue(this.trainer);
    }
    $('#addTrainerModal').modal('show');
  }

  generateIDCard() {
    if (!this.trainer?.Id) { // Only generate for new trainers
      let nextNumber = 1;
      if (this.lastIDCard) {
        const lastNumber = parseInt(this.lastIDCard, 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      this.form.patchValue({
        IDCard: nextNumber.toString().padStart(4, '0')
      });
    }
  }
async save() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  try {
    this.isSpinner = true;
    const trainerData = this.form.getRawValue(); // Gets ALL values including disabled
    const res: any = await lastValueFrom(this.trainerService.saveTrainer(trainerData));
    
    if (res.State) {
      this.toaster.success("Saved successfully");
      this.cancel();
    }
  } catch (error) {
    console.error('Error saving Trainer', error);
    this.toaster.error("Failed to save trainer");
  } finally {
    this.isSpinner = false;
  }
}

  cancel() {
    $('#addTrainerModal').modal('hide');
    this.closeAddTrainerModal.emit();
  }
}
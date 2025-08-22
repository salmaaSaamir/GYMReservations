import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Reservation } from 'src/app/core/models/Reservation';
import { ReservationService } from 'src/app/core/services/ReservationService';
import { ClassService } from 'src/app/core/services/ClassService';
import { MemberService } from 'src/app/core/services/MemberService';
import { cpSync } from 'fs';

declare var $: any;

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {

  @Input() Reservation?: Reservation;
  @Output() closeAddReservationModal = new EventEmitter();
  isSpinner = false;
  form: FormGroup;
  classes: any[] = [];
  members: any[] = [];
  classAvailability: any = null;
  IsmemberHasReservationCheck=false;

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService, 
    private reservationService: ReservationService,
    private classService: ClassService,
    private memberService: MemberService,
  ) {
    this.form = this.fb.group({
      Id: [0],
      ClassId: [0, [Validators.required, Validators.min(1)]],
      MemberId: [0, [Validators.required, Validators.min(1)]],
    });

    // Add value changes listeners for real-time validation
    this.form.get('ClassId')?.valueChanges.subscribe(classId => {
      if (classId > 0) {
        this.checkClassAvailability(classId);
        // When class changes, also check member reservation if member is already selected
        const memberId = this.form.get('MemberId')?.value;
        if (memberId > 0) {
          this.checkMemberReservation(memberId, classId);
        }
      } else {
        this.classAvailability = null;
        this.IsmemberHasReservationCheck = false; // Reset member reservation check
      }
    });

    this.form.get('MemberId')?.valueChanges.subscribe(memberId => {
      const classId = this.form.get('ClassId')?.value;
      if (memberId > 0 && classId > 0) {
        this.checkMemberReservation(memberId, classId);
      } else {
        this.IsmemberHasReservationCheck = false; // Reset member reservation check
      }
    });
  }

  async ngOnInit() {
    await this.loadData();
    if (this.Reservation) {
      this.form.patchValue(this.Reservation);
      // If editing, trigger validation checks
      if (this.Reservation.ClassId > 0) {
        this.checkClassAvailability(this.Reservation.ClassId);
      }
      if (this.Reservation.MemberId > 0 && this.Reservation.ClassId > 0) {
        this.checkMemberReservation(this.Reservation.MemberId, this.Reservation.ClassId);
      }
    }
    $('#addReservationModal').modal('show');
  }

  async loadData() {
    try {
      // Load classes
      const classesRes: any = await lastValueFrom(this.classService.getAllClasses());
      if (classesRes.State) {
        this.classes = classesRes.Data[0] || [];
      }
      // Load members
      const membersRes: any = await lastValueFrom(this.memberService.getAllMembers());
      if (membersRes.State) {
        this.members = membersRes.Data[0] || [];
      }
    } catch (error) {
      console.error('Error loading data', error);
      this.toaster.error("Failed to load data");
    }
  }

  async checkClassAvailability(classId: number) {
    try {
      const res: any = await lastValueFrom(
        this.reservationService.checkClassAvailability(classId)
      );
      if (res.State) {
        this.classAvailability = res.Data[0];
      }
    } catch (error) {
      console.error('Error checking class availability', error);
    }
  }

  async checkMemberReservation(memberId: number, classId: number) {
    try {
      
      // Find the selected class to get the classDay
      const selectedClass = this.classes.find(c => c.Id === +classId);
      
      
      if (!selectedClass) {
        console.error('Class not found');
        return;
      }

      const classDay = selectedClass.ClassDay;
      

      const res: any = await lastValueFrom(
        this.reservationService.checkMemberReservation( +classId,+memberId, classDay)
      );
      
      this.IsmemberHasReservationCheck = res.State
    } catch (error) {
      console.error('Error checking member reservation', error);
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      this.isSpinner = true;
      const reservationData = this.form.value;
      const res: any = await lastValueFrom(
        this.reservationService.saveReservation(reservationData)
      );
      
      if (res.State) {
        this.toaster.success("Reservation saved successfully");
        this.cancel();
      } else if (res.ErrorMessage) {
        this.toaster.error(res.ErrorMessage);
      }
    } catch (error: any) {
      console.error('Error saving reservation', error);
      this.toaster.error(error.error?.ErrorMessage || "Failed to save reservation");
    } finally {
      this.isSpinner = false;
    }
  }

  cancel() {
    $('#addReservationModal').modal('hide');
    this.closeAddReservationModal.emit();
  }

  // Helper method to get class info
  getSelectedClass() {
    const classId = this.form.get('ClassId')?.value;
    return this.classes.find(c => c.Id === classId);
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
}
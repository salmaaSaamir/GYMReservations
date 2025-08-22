import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ClassService } from 'src/app/core/services/ClassService';
declare var $: any;

@Component({
  selector: 'app-show-class-reservations',
  templateUrl: './show-class-reservations.component.html',
  styleUrls: ['./show-class-reservations.component.css']
})
export class ShowClassReservationsComponent implements OnInit {
  @Input() classId: number = 0;
  @Input() className: string = '';

  @Output() closeShoeModal = new EventEmitter();
  data: any[] = [];
  constructor(private ClassService: ClassService) { }

  ngOnInit(): void {
    this.loadReservation();
    $('#showClassReservationModal').modal('show');
  }

  async loadReservation() {
    try {
      const res: any = await lastValueFrom(
        this.ClassService.getClassReservations(this.classId)
      );
      
      if (res.State) {
        this.data = res.Data[0];

      }
    } catch (error) {
      console.error('Error loading resevations', error);
    }
  }
  cancel() {
    $('#showClassReservationModal').modal('hide');
    this.closeShoeModal.emit();
  }
}

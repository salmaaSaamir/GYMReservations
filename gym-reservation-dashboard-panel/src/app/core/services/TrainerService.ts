import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  readonly APIUrl = environment.backApiUrl + 'Trainers/';

  constructor(private http: HttpClient) { }

  
  /** GET: Get paginated Trainers */
  getTrainers(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetTrainers?page=${page}&pageSize=${pageSize}`);
  }

  /** POST: Add or update Trainer */
  saveTrainer(Trainer: any) {
    return this.http.post(`${this.APIUrl}SaveTrainer`, Trainer);
  }
 
  /** DELETE: Delete a Trainer by Id */
  deleteTrainer(id: number) {
    return this.http.delete(`${this.APIUrl}DeleteTrainer/${id}`);
  }
}

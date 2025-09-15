import { Component, OnInit } from '@angular/core';
import PureCounter from '@srexi/purecounterjs';
import { OfferService } from '../../core/services/OfferService';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-abouts-us',
  standalone: true,
  imports: [],
  templateUrl: './abouts-us.component.html',
  styleUrls: ['./abouts-us.component.css']
})
export class AboutsUsComponent implements OnInit {
  constructor(private offerService: OfferService) { }
  CurrentState: any
  ngOnInit(): void {
    this.GetGymStatsData()
    new PureCounter();
  }

  async GetGymStatsData() {
    //call api to get active offer data
    try {

      const res: any = await lastValueFrom(
        this.offerService.GetGymStatsAsync()
      );
      
      if (res.State) {
        this.CurrentState = res.Data[0]
      } else if (res.ErrorMessage) {
      }
    } catch (error: any) {
      console.error('Error Get response', error);
    }
  }
}

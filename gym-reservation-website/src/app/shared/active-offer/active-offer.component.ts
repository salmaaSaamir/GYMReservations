import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { OfferService } from '../../core/services/OfferService';

@Component({
  selector: 'app-active-offer',
  standalone: true,
  imports: [LottieComponent, CommonModule],
  templateUrl: './active-offer.component.html',
  styleUrls: ['./active-offer.component.css']
})
export class ActiveOfferComponent implements OnInit {
  constructor(private offerService: OfferService) { }
  CurrentOffer: any
  isVisible = false
  // Animation options
  smokeOptions: AnimationOptions = {
    path: '/assets/animations/fall smoke dust.json',
    loop: true,
    autoplay: true
  };

  giftOptions: AnimationOptions = {
    path: '/assets/animations/Happy gift.json',
    loop: true,
    autoplay: true
  };

  ngOnInit(): void {
    this.GetActiveOfferData()
    // Show the offer after 3 seconds
    setTimeout(() => {
      this.isVisible = true
    }, 3000);
  }

  closeOfferDeal() {
    this.isVisible = false
  }
  async GetActiveOfferData() {
    //call api to get active offer data
    try {

      const res: any = await lastValueFrom(
        this.offerService.GetLastOfferForWebsite()
      );
      if (res.State) {
        this.CurrentOffer = res.Data[0]
      } else if (res.ErrorMessage) {
      }
    } catch (error: any) {
      console.error('Error Get response', error);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-active-offer',
  standalone: true,
  imports: [LottieComponent, CommonModule],
  templateUrl: './active-offer.component.html',
  styleUrls: ['./active-offer.component.css']
})
export class ActiveOfferComponent implements OnInit {

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
    setTimeout(() => {
      this.isVisible = true
    }, 3000);
  }

  closeOfferDeal(){
    this.isVisible = false
  }
}

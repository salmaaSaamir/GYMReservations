import { Component, OnInit } from '@angular/core';
import PureCounter from '@srexi/purecounterjs';

@Component({
  selector: 'app-abouts-us',
  standalone: true,
  imports: [],
  templateUrl: './abouts-us.component.html',
  styleUrls: ['./abouts-us.component.css']
})
export class AboutsUsComponent implements OnInit {
  ngOnInit(): void {
    new PureCounter();
  }
}

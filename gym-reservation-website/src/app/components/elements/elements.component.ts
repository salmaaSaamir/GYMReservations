import { AfterViewInit, Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.counter').counterUp({
        delay: 10,
        time: 2000
      });
    }, 500); // أضمن إن الـ DOM جاهز بالكامل
  }
}

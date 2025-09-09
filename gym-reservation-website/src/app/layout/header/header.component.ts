import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  activeSection: string = '';
  menuOpen: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = document.querySelectorAll('#about,#calender,#contact,#offer');
    let current = '';

    sections.forEach((section: any) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        current = section.id;
      }
    });

    this.activeSection = current;
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}

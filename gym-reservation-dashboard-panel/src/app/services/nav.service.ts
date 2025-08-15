import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavService {
  showClass: any = false;

  // BehaviorSubject replaces signal
  private currentUrlSubject = new BehaviorSubject<string | undefined>(undefined);
  currentUrl$ = this.currentUrlSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrlSubject.next(event.urlAfterRedirects);
      }
    });
  }

  // Optional helper if you still want get/set methods
  getCurrentUrl(): string | undefined {
    return this.currentUrlSubject.value;
  }

  setCurrentUrl(url: string) {
    this.currentUrlSubject.next(url);
  }
}

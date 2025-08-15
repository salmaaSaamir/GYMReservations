import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSettings, defaults } from '../config';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  // BehaviorSubject will hold the latest value and allow subscribers to get updates
  private optionsSubject = new BehaviorSubject<AppSettings>(defaults);

  // Observable for components to subscribe to
  options$ = this.optionsSubject.asObservable();

  getOptions(): AppSettings {
    return this.optionsSubject.value;
  }

  setOptions(options: Partial<AppSettings>) {
    const current = this.optionsSubject.value;
    this.optionsSubject.next({
      ...current,
      ...options,
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const DARK_MODE_KEY = 'isDarkMode';

@Injectable()
export class ThemeService {
  private themeClassSource = new BehaviorSubject<string>('app-light-theme');
  public themeClass$ = this.themeClassSource.asObservable();

  private isDarkModeSource = new BehaviorSubject<boolean>(
    localStorage.getItem(DARK_MODE_KEY) === 'true'
  );
  public isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor() {
    this.isDarkMode$.subscribe(isDarkMode => {
      // doing it this way so adding more themes later should be easier
      localStorage.setItem(DARK_MODE_KEY, isDarkMode + '');
      this.themeClassSource.next(
        isDarkMode ? 'app-dark-theme' : 'app-light-theme'
      );
    });
  }

  public toggleDarkMode(): void {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
}

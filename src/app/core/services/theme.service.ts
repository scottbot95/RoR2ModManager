import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

const DARK_MODE_KEY = 'isDarkMode';

@Injectable()
export class ThemeService {
  private oldThemeClass: string;
  private themeClassSource = new BehaviorSubject<string>('app-light-theme');
  public themeClass$ = this.themeClassSource.asObservable();

  private isDarkModeSource = new BehaviorSubject<boolean>(
    localStorage.getItem(DARK_MODE_KEY) === 'true'
  );
  public isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor(private overlay: OverlayContainer) {
    const { classList } = this.overlay.getContainerElement();

    this.isDarkMode$.subscribe(isDarkMode => {
      // doing it this way so adding more themes later should be easier
      localStorage.setItem(DARK_MODE_KEY, isDarkMode + '');
      const newThemeClass = isDarkMode ? 'app-dark-theme' : 'app-light-theme';
      this.themeClassSource.next(newThemeClass);
      classList.remove(this.oldThemeClass);
      classList.add(newThemeClass);
      this.oldThemeClass = newThemeClass;
    });
  }

  public toggleDarkMode(): void {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
}

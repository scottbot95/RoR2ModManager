import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserPreferences } from '../../../electron/preferences.model';
import { prefs } from '../../../electron/prefs';

@Injectable()
export class ThemeService {
  private oldThemeClass: string;

  private themeClassSource = new BehaviorSubject<string>('app-light-theme');
  public themeClass$ = this.themeClassSource.asObservable();

  private isDarkModeSource = new BehaviorSubject<boolean>(
    !!(<UserPreferences['darkMode']>prefs.get('darkMode'))
  );
  public isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor(private overlay: OverlayContainer) {
    const { classList } = this.overlay.getContainerElement();

    this.isDarkMode$.subscribe(isDarkMode => {
      // doing it this way so adding more themes later should be easier
      prefs.set('darkMode', isDarkMode);
      const newThemeClass = isDarkMode ? 'app-dark-theme' : 'app-light-theme';
      this.themeClassSource.next(newThemeClass);
      classList.remove(this.oldThemeClass);
      classList.add(newThemeClass);
      this.oldThemeClass = newThemeClass;
    });

    prefs.onDidChange('darkMode', (oldVal, newVal) => {
      if (oldVal !== newVal) this.isDarkModeSource.next(!!newVal);
    });
  }

  public toggleDarkMode(): void {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
}

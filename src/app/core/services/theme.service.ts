import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserPreferences } from '../../../electron/preferences.model';
import { PreferencesService } from './preferences.service';

@Injectable()
export class ThemeService {
  private oldThemeClass: string;

  private themeClassSource = new BehaviorSubject<string>('app-light-theme');
  public themeClass$ = this.themeClassSource.asObservable();

  private isDarkModeSource = new BehaviorSubject<boolean>(
    !!(<UserPreferences['darkMode']>this.prefs.get('darkMode'))
  );
  public isDarkMode$ = this.isDarkModeSource.asObservable();

  constructor(
    private overlay: OverlayContainer,
    private prefs: PreferencesService
  ) {
    const { classList } = this.overlay.getContainerElement();

    this.isDarkMode$.subscribe(isDarkMode => {
      // doing it this way so adding more themes later should be easier
      this.prefs.set('darkMode', isDarkMode);
      const newThemeClass = isDarkMode ? 'app-dark-theme' : 'app-light-theme';
      this.themeClassSource.next(newThemeClass);
      classList.remove(this.oldThemeClass);
      classList.add(newThemeClass);
      this.oldThemeClass = newThemeClass;
    });

    prefs.onChange('darkMode').subscribe(({ oldValue, newValue }) => {
      if (oldValue !== newValue) this.isDarkModeSource.next(!!newValue);
    });
  }

  public toggleDarkMode(): void {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
}

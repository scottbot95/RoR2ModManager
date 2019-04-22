import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class MockHttpClient {
  get() {}
  post() {}
  delete() {}
  put() {}
}

export class MockThemeService {
  private isDarkModeSource = new BehaviorSubject<boolean>(false);
  toggleDarkMode() {
    this.isDarkModeSource.next(!this.isDarkModeSource.value);
  }
  isDarkMode$ = this.isDarkModeSource.asObservable();
  themeClass$ = this.isDarkModeSource
    .asObservable()
    .pipe(map(darkMode => (darkMode ? 'app-dark-theme' : 'app-light-theme')));
}

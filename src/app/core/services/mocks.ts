import {
  UserPreferences,
  defaultConfig
} from '../../../electron/preferences.model';
import { ChangeEvent } from './preferences.service';
import { Observable, of } from 'rxjs';

export class MockPreferencesService {
  private data: UserPreferences = defaultConfig;

  set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    this.data[key] = value;
  }

  get<K extends keyof UserPreferences>(key: K) {
    return this.data;
  }

  onChange<K extends keyof UserPreferences>(
    key: K
  ): Observable<ChangeEvent<UserPreferences[K]>> {
    return of({ oldValue: undefined, newValue: undefined });
  }
}

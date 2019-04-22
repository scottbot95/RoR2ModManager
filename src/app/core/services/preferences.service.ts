import { Injectable } from '@angular/core';
import { UserPreferences } from '../../../electron/preferences.model';
import { prefs } from '../../../electron/prefs';
import { Observable, Subject } from 'rxjs';

export interface ChangeEvent<T> {
  oldValue: T;
  newValue: T;
}

@Injectable()
export class PreferencesService {
  constructor() {}

  set<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    prefs.set(key, value);
  }

  get<K extends keyof UserPreferences>(key: K) {
    return prefs.get(key);
  }

  onChange<K extends keyof UserPreferences>(
    key: K
  ): Observable<ChangeEvent<UserPreferences[K]>> {
    const subject = new Subject<ChangeEvent<UserPreferences[K]>>();

    prefs.onDidChange(
      key,
      // Parameters out of order in typescript definition (see https://github.com/sindresorhus/conf/issues/69)
      (newValue: UserPreferences[K], oldValue: UserPreferences[K]) => {
        subject.next({ oldValue, newValue });
      }
    );

    return subject.asObservable();
  }
}

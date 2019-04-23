type cb = (newValue: any, oldValue: any) => void;

class WebPrefsStore {
  private watchers: { [key: string]: cb[] } = {};

  get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
  set(key: string, value: any) {
    const keyWatchers = this.watchers[key];
    if (Array.isArray(keyWatchers) && keyWatchers.length > 0) {
      const oldValue = this.get(key);
      keyWatchers.forEach(watcher => watcher(value, oldValue));
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
  onDidChange(key: string, callback: cb) {
    if (!Array.isArray(this.watchers[key])) {
      this.watchers[key] = [];
    }

    this.watchers[key].push(callback);
  }
}

export const prefs = new WebPrefsStore();

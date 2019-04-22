const data = {};

export const prefs = {
  get(key: string) {
    return data[key];
  },
  set(key: string, val: any) {
    data[key] = val;
  },
  onDidChange(...args: any[]) {}
};

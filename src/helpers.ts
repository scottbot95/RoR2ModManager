export const isSpecRunning = (() => {
  if ((window as any).jasmine) {
    let specRunning = false;
    ((window as any).jasmine as typeof jasmine).getEnv().addReporter({
      specStarted() {
        specRunning = true;
      },
      specDone() {
        specRunning = false;
      }
    });
    return () => specRunning;
  } else {
    // @ts-ignore
    return () => !!currentSpec;
  }
})();

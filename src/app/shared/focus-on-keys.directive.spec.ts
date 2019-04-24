import { FocusOnKeysDirective } from './focus-on-keys.directive';
import { ElementRef } from '@angular/core';

class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

describe('FocusOnKeysDirective', () => {
  it('should create an instance', () => {
    const mockRef = new MockElementRef();
    const directive = new FocusOnKeysDirective(mockRef);
    expect(directive).toBeTruthy();
  });
});

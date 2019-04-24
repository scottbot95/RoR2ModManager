import { FocusOnKeysDirective } from './focus-on-keys.directive';
import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import * as Mousetrap from 'mousetrap';
import { By } from '@angular/platform-browser';

@Component({
  template: '<input [appFocusOnKeys]="keybinds">'
})
class TestHostComponent {
  keybinds = ['command+f', 'ctrl+f'];
}

describe('FocusOnKeysDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: DebugElement;
  let spy: jasmine.Spy;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FocusOnKeysDirective, TestHostComponent]
    });

    spy = spyOn(Mousetrap, 'bind');
    spyOn(Mousetrap, 'unbind');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));

    spyOn(inputEl.nativeElement, 'focus').and.callThrough();

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should register the keybind', () => {
    expect(Mousetrap.bind).toHaveBeenCalledWith(
      component.keybinds,
      jasmine.any(Function)
    );
  });

  it('should focus on key combo', () => {
    // trigger the bind callback provided
    spy.calls.mostRecent().args[1]();

    expect(inputEl.nativeElement.focus).toHaveBeenCalled();
  });
});

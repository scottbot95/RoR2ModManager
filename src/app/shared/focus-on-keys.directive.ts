import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as Mousetrap from 'mousetrap';

@Directive({
  selector: '[appFocusOnKeys]'
})
export class FocusOnKeysDirective implements OnInit, OnDestroy {
  @Input('appFocusOnKeys') keyCombo: string | string[];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    Mousetrap.bind(this.keyCombo, () => this.el.nativeElement.focus());
  }

  ngOnDestroy() {
    Mousetrap.unbind(this.keyCombo);
  }
}

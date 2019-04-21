import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    class: 'flex col grow'
  }
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

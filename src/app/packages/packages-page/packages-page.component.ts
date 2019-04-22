import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-packages-page',
  templateUrl: './packages-page.component.html',
  styleUrls: ['./packages-page.component.scss'],
  host: {
    class: 'flex col grow'
  }
})
export class PackagesPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

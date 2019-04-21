import { Component, OnInit } from '@angular/core';
import { ThunderstoreService } from '../core/services/thunderstore.service';

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
  constructor(private thunderstore: ThunderstoreService) {}

  ngOnInit() {
    this.thunderstore.allPackages$.subscribe(packages => {
      console.log(packages);
    });
  }
}

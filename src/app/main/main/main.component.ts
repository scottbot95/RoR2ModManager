import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(private profile: ProfileService) {}

  ngOnInit() {
    this.profile.registerMenuHandlers();
  }
}

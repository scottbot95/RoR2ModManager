import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileService } from './services/profile.service';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  providers: [ProfileService]
})
export class ProfileModule {}

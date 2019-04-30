import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material';
import { ProfileService } from './services/profile.service';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

@NgModule({
  declarations: [ImportDialogComponent],
  imports: [SharedModule, MatDialogModule],
  providers: [ProfileService],
  entryComponents: [ImportDialogComponent]
})
export class ProfileModule {}

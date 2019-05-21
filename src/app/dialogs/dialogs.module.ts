import { NgModule } from '@angular/core';

import { DialogsRoutingModule } from './dialogs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material';
import { NewProfileDialogComponent } from './new-profile-dialog/new-profile-dialog.component';
import { DialogService } from './services/dialog.service';
import { RenameProfileDialogComponent } from './rename-profile-dialog/rename-profile-dialog.component';

@NgModule({
  declarations: [NewProfileDialogComponent, RenameProfileDialogComponent],
  imports: [SharedModule, DialogsRoutingModule, MatDialogModule],
  providers: [DialogService]
})
export class DialogsModule {}

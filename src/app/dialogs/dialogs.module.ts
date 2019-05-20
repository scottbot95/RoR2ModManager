import { NgModule } from '@angular/core';

import { DialogsRoutingModule } from './dialogs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material';
import { NewProfileDialogComponent } from './new-profile-dialog/new-profile-dialog.component';

@NgModule({
  declarations: [NewProfileDialogComponent],
  imports: [SharedModule, DialogsRoutingModule, MatDialogModule]
})
export class DialogsModule {}

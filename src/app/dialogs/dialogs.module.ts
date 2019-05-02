import { NgModule } from '@angular/core';

import { DialogsRoutingModule } from './dialogs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [ImportDialogComponent],
  imports: [SharedModule, DialogsRoutingModule, MatDialogModule]
})
export class DialogsModule {}

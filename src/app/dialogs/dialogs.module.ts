import { NgModule } from '@angular/core';

import { DialogsRoutingModule } from './dialogs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [SharedModule, DialogsRoutingModule, MatDialogModule]
})
export class DialogsModule {}

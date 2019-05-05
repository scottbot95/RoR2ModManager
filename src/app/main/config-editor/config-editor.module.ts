import { NgModule } from '@angular/core';

import { ConfigEditorRoutingModule } from './config-editor-routing.module';
import { FoundConfigTableComponent } from './found-config-table/found-config-table.component';
import { SharedModule } from '../../shared/shared.module';
import { EditorComponent } from './editor/editor.component';
import { ConfigParserService } from './services/config-parser.service';
import { ConfigSectionComponent } from './config-section/config-section.component';

@NgModule({
  declarations: [FoundConfigTableComponent, EditorComponent, ConfigSectionComponent],
  imports: [SharedModule, ConfigEditorRoutingModule],
  providers: [ConfigParserService]
})
export class ConfigEditorModule {}

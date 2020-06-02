import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NguiMapModule} from '@ngui/map';
import {MpmEditableCoordinateDialogComponent} from './mpm-editable-coordinate-dialog/mpm-editable-coordinate-dialog.component';
import {SharedModule} from '@shared/shared.module';
import {MpmMapSelectionDialogComponent} from './mpm-map-selection-dialog/mpm-map-selection-dialog.component';
import {MpmTerminalComponent} from './mpm-terminal/mpm-terminal.component';
import { MpmAllComponent } from './mpm-all/mpm-all.component';

@NgModule({
  declarations: [MpmEditableCoordinateDialogComponent, MpmMapSelectionDialogComponent, MpmTerminalComponent, MpmAllComponent],
  imports: [
    CommonModule,
    SharedModule,
    NguiMapModule.forRoot({
      apiUrl: `https://maps.google.com/maps/api/js?libraries=drawing&key=AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug`
    }),
  ],
  exports: [MpmTerminalComponent, MpmAllComponent],
  entryComponents: [
    MpmEditableCoordinateDialogComponent,
    MpmMapSelectionDialogComponent,
  ]
})
export class MapManagementModule {
}

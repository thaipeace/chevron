import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadButtonWithTemplateComponent} from './upload-button-with-template/upload-button-with-template.component';
import {UploadByDropComponentComponent} from './upload-by-drop-component/upload-by-drop-component.component';

@NgModule({
  declarations: [UploadButtonWithTemplateComponent, UploadByDropComponentComponent],
  imports: [
    CommonModule
  ],
  exports: [
    UploadButtonWithTemplateComponent, UploadByDropComponentComponent
  ]
})
export class UploadComponentsModule {
}


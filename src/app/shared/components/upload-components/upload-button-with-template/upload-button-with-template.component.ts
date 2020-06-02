import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DialogService} from '@shared/services/others/dialog.service';

@Component({
  selector: '[app-upload-button-with-template]',
  templateUrl: './upload-button-with-template.component.html',
  styleUrls: ['./upload-button-with-template.component.scss']
})
export class UploadButtonWithTemplateComponent implements OnInit {
  @Output() onUpload = new EventEmitter();
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  errors: string[];

  constructor(private _DialogService: DialogService) {
  }

  ngOnInit() {
  }

  onClickToUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.onFileChange(fileInput.target.files[0]);
    }
  }

  loadData($event: MouseEvent) {
    this.uploadInput.nativeElement['value'] = '';
    this.uploadInput.nativeElement.click();
  }

  onFileChange(file: any) {
    const self = this;
    const fileTypes = ['csv'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (fileTypes.indexOf(extension) < 0) {
      this._DialogService.alert('Only accept file types: ' + fileTypes.toString());
      return;
    }

    if (file.size >= 4194304) {
      this._DialogService.alert('Maximum file size is 4MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e: any) {
      try {
        self.onUpload.emit(e.target.result.split(',')[1]);
      } catch (e) {
        self._DialogService.alert(e);
      }
    };

    reader.readAsDataURL(file);
  }
}


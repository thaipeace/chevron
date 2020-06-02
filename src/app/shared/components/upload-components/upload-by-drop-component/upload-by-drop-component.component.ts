import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-upload-by-drop-component',
  templateUrl: './upload-by-drop-component.component.html',
  styleUrls: ['./upload-by-drop-component.component.scss']
})
export class UploadByDropComponentComponent implements OnInit {
  @Input() inputTypes: string[] = [];
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  @ViewChild('dropContainer') dropContainer: ElementRef<HTMLElement>;

  errors: string[] = [];
  uploadFileName: string;
  tmpFileInBase64: any;
  file: any;

  constructor() {
  }

  ngOnInit() {
    this.constructDrop();
  }

  constructDrop() {
    const el: HTMLElement = this.dropContainer.nativeElement;
    el.ondragover = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.add('onDragOver');
    };
    el.ondragleave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('onDragOver');
    };
    el.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      el.classList.remove('onDragOver');
      this.onFileChange(e.dataTransfer.files[0]);
    };
  }

  onFileChange(file: File) {
    this.uploadFileName = null;
    const fileTypes = this.inputTypes;
    const extension = file.name.split('.').pop().toLowerCase();

    this.errors = [];

    if (fileTypes.indexOf(extension) < 0) {
      this.errors.push('Only accept file types: ' + fileTypes.toString());
      return;
    }

    if (file.size >= 4194304) {
      this.errors.push('Maximum file size is 4MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.tmpFileInBase64 = e.target.result.split(',')[1];
      this.onChange.emit({metaData: file, source: this.tmpFileInBase64});
    };

    this.file = {fileName: file.name, extension: extension};
    reader.readAsDataURL(file);
  }

  triggerUploadFile($event: MouseEvent) {
    this.uploadInput.nativeElement['value'] = '';
    this.uploadInput.nativeElement.click();
  }

  onClickToUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.onFileChange(fileInput.target.files[0]);
    }

  }
}

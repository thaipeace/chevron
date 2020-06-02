import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-pdf-dialog',
    templateUrl: './pdf-dialog.component.html',
    styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent extends DefaultDialogComponent implements OnInit {
    static DEFAULT_WIDTH: number = 1300;
    title: any;
    topRight: string;
    src: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PdfDialogComponent>,
        private sanitizer: DomSanitizer) {
        super(dialogRef);
    }

    ngOnInit() {
        this.title = this.data.title || '';
        this.topRight = this.data.topRight || '';
        this.src = this.getURL(this.data.src) || '';
    }

    getURL(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}

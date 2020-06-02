import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, Validators, FormControl } from '@angular/forms';
import { telPhoneValidator } from '@app/shared/validators/telPhone';

@Component({
    selector: 'array-input',
    templateUrl: './array-input.component.html',
    styleUrls: ['./array-input.component.scss']
})
export class ArrayInputComponent implements OnInit {
    @Input() formArray: FormArray;
    @Input() isSubmitted: boolean = false;
    @Input() wFull: boolean = false;
    @Input() length: number;
    @Input() placeholder: number;
    @Input() type: string;
    @Input() border: boolean = false;
    @Input() widthtype: string;
    @Input() isCreateInsertable: boolean = true;
    constructor() {}

    ngOnInit() {
        console.log(this.formArray);
    }

    addControl(): void {
        this.formArray.push(new FormControl('', [Validators.required]));
    }

    canAddNew(): boolean {
        return this.formArray.controls.length >= this.length;
    }

    onRemove(index: number) {
        this.formArray.removeAt(index);
    }

    getFirstError(obj: object) {
        return Object.keys(obj)[0];
    }
}

import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-editable-textbox',
  templateUrl: './editable-textbox.component.html',
  styleUrls: ['./editable-textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTextboxComponent implements OnInit, OnChanges {
  @Input() value: string;
  @Input() isRequired: boolean;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  state: TextboxStateEnum;

  textBoxControl: FormControl = new FormControl();
  displayValue: string;

  constructor(
    private _changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.textBoxControl.setValue(this.value);
    this.state = TextboxStateEnum.Reading;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { value } = changes;

    if (!!value) {
      this.displayValue = value.currentValue;
      this.textBoxControl.setValue(value.currentValue);
    }
  }

  isReading(): boolean {
    return this.state === TextboxStateEnum.Reading;
  }

  isEditing(): boolean {
    return this.state === TextboxStateEnum.Editing;
  }

  switchToEdit(textbox: HTMLInputElement) {
    this.state = TextboxStateEnum.Editing;
    this._changeDetector.markForCheck();
    setTimeout(() => {
      textbox.focus();
    }, 100);
  }

  switchToReadonly() {
    this.state = TextboxStateEnum.Reading;
    this._changeDetector.markForCheck();
  }

  blur() {
    setTimeout(() => {
      if (this.displayValue !== this.textBoxControl.value) {
        this.save();
      }
      this.switchToReadonly();
    }, 400);
  }

  discard() {
    console.error('disadasd');
    this.textBoxControl.setValue(this.displayValue);
  }

  save() {
    if (this.isRequired && !this.textBoxControl.value) {
      this.discard();
    } else {
      this.displayValue = this.textBoxControl.value;
      this.valueChange.emit(this.textBoxControl.value);
    }
  }
}

enum TextboxStateEnum {
  Reading,
  Editing
}

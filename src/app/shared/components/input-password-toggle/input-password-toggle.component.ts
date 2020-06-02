import { Component, OnInit, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-input-password-toggle',
  templateUrl: './input-password-toggle.component.html',
  styleUrls: ['./input-password-toggle.component.scss']
})
export class InputPasswordToggleComponent implements OnInit, OnChanges {
  @Input() inputField: HTMLInputElement;
  @Input() className: string;
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  isPassword = true;
  classes: string[] = ['append', 'toggle-password'];

  constructor(private _elementRef: ElementRef) { }

  onClick() {
    this.inputField.type = this.inputField.type === 'text' ? 'password' : 'text';
    this.isPassword = !this.isPassword;
    this.toggle.emit(this.isPassword);
    this.inputField.focus();
  }

  ngOnInit() {
    this._elementRef.nativeElement.classList.add('append-input-wrapper');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { className } = changes;
    if (!!className && !!className.currentValue) {
    this.classes = ['append', 'toggle-password'];
    className.currentValue.forEach(element => {
        this.classes.push(element);
      });
    }
  }
}

import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[digitOnly]'
})
export class DigitOnlyDirective {
    constructor(private _el: ElementRef) {}

    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    private specialKeys: Array<string> = ['Backspace', 'End', 'ArrowLeft', 'ArrowRight'];

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        let current: string = this._el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}

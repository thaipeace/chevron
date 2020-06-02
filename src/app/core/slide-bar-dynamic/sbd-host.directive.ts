import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
    selector: '[appSbdHost]'
})
export class SbdHostDirective {

    constructor(public viewContainerRef: ViewContainerRef) {
    }

}

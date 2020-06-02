import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[select-menu-item]' })
export class SelectItemTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[empty-item]' })
export class EmptyTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

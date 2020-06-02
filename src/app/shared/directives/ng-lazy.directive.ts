import { Input, Directive, TemplateRef, ViewContainerRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[ngLazy]',
})
export class NgLazyDirective {
    private _isRendered: boolean = false;
    private _element: any;

    constructor(
        private _viewContainer: ViewContainerRef,
        private _templateRef: TemplateRef<any>,
        private renderer: Renderer2,
    ) {
    }

    @Input()
    set ngLazy(condition: boolean) {
        if (!this._isRendered && this._templateRef && condition) {
            this._element = this._viewContainer.createEmbeddedView(this._templateRef).rootNodes[0];
            this._isRendered = true;
            return;
        }

        if (!this._isRendered) {
            return;
        }

        if (condition) {
            this.renderer.removeClass(this._element, 'hidden');
        } else {
            this.renderer.addClass(this._element, 'hidden');
        }
    }
}
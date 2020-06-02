import {ComponentFactoryResolver, Directive, Inject, Input, Renderer2, ViewContainerRef} from '@angular/core';
import {SpinLoadingComponent} from '@shared/components/spin-loading/spin-loading.component';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {DialogService} from '@shared/services/others/dialog.service';

@Directive({
  selector: '[appSpinLoading]'
})
export class SpinLoadingDirective {
  @Input() showAnimation: boolean = null;
  @Input() positionFixed: boolean = true;
  _viewContainer: ViewContainerRef;
  isLoading: boolean = false;
  instance: any;


  constructor(private viewContainer: ViewContainerRef,
              private _ComponentFactoryResolver: ComponentFactoryResolver,
              private _DialogService: DialogService,
              private _LoadingBarService: LoadingBarService) {
    this._viewContainer = viewContainer;
    this._LoadingBarService.progress$.subscribe((el) => {
      if (!el && this.isLoading) {
        //api stop
        this.isLoading = false;
        this.remove();
      }
      if (el && !this.isLoading) {
        //api running
        this.isLoading = true;
        this.add();
      }
    });
  }

  add() {
    if (!this.instance) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(SpinLoadingComponent);
      const componentRef = this._viewContainer.createComponent(componentFactory);
      this.instance = (<SpinLoadingComponent>componentRef.instance);
      this.instance.class = this.positionFixed ? SpinLoadingComponent.CLASSES.FIXED : SpinLoadingComponent.CLASSES.ABSOLUTE;
      if (this._DialogService.isOpenObservable.source['value'] === true) {
        this.instance.class += ' ' + SpinLoadingComponent.CLASSES.TOP;
      }
      if (this.showAnimation !== null) {
        this.instance.showAnimation = this.showAnimation;
      }
    }
  }

  remove() {
    if (this.instance) {
      this._viewContainer.clear();
      this.instance = null;
    }

  }

}

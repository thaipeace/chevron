import {
  Directive,
  Output,
  ElementRef,
  NgZone,
  OnInit,
  OnDestroy,
  Self,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Directive({ selector: '[resizewatch]' })
export class ResizeWatchDirective implements OnInit, OnDestroy {
  private _intervalHandle: any;
  private _lastHeight: number;
  private _lastWidth: number;

  @Output() resizewatch = new EventEmitter<any>();

  constructor(@Self() private element: ElementRef,
    private zone: NgZone) {
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this._intervalHandle = setInterval(() => this._checkDimension(false), 200);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this._intervalHandle);
  }

  @HostListener('window:resize') onresize() {
    this._checkDimension();
  }

  private _checkDimension(isInAngularZone: boolean = true) {
    const { nativeElement } = this.element,
      newHeight = nativeElement.offsetHeight,
      newWidth = nativeElement.offsetWidth;

    if (this._lastHeight != newHeight ||
      this._lastWidth != newWidth) {
      this._lastHeight = newHeight;
      this._lastWidth = newWidth;
      if (isInAngularZone) {
        this.resizewatch.emit({ newWidth, newHeight });
      }
      else {
        this.zone.runGuarded(() => {
          this.resizewatch.emit({ newWidth, newHeight });
        });
      }
    }
  }
}
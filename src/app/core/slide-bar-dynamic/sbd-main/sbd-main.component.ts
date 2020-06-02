import {Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {SbdHostDirective} from '@app/core/slide-bar-dynamic/sbd-host.directive';
import {SideBarService} from '@shared/services/side-bar.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {DynamicItem, IDynamicComponent} from '@shared/models/dynamic-item.class';
import {ResizeService} from '@shared/services/resize.service';

@Component({
  selector: 'app-sbd-main',
  templateUrl: './sbd-main.component.html',
  styleUrls: ['./sbd-main.component.scss']
})
export class SbdMainComponent extends DefaultComponent implements OnInit, OnDestroy {
  @Input() containerId: string;
  @Input() className: string = '';
  @ViewChild(SbdHostDirective) appSbdHost: SbdHostDirective;
  show = false;
  control: SideBarControl;
  data: DynamicItem;

  constructor(private _SideBarService: SideBarService,
              private _ComponentFactoryResolver: ComponentFactoryResolver) {
    super();
    this.addSubscribes(
      this._SideBarService.openObservable
        .subscribe((rs) => {
          if (rs && rs instanceof DynamicItem) {
            this.data = rs;
            if ((!!this.containerId || !!this.data.containerId) && this.containerId !== this.data.containerId) {
              return;
            }
            this.open();
            this.loadComponent();
            // console.log(rs);
          }
        }),
      this._SideBarService.statusObservable
        .subscribe((rs) => {
          if (rs.status === SideBarService.STATUSES.CLOSE) {
            this.close();
          }
        })
    );

  }

  ngOnInit() {
    const self = this;
    self.control = new SideBarControl({
      close: () => {
        self.close();
      }
    });
  }

  open() {
    this.show = true;
    setTimeout(() => {
      ResizeService.resize();
    });
  }

  close() {
    this.show = false;
    setTimeout(() => {
      ResizeService.resize();
    });
  }

  loadComponent() {
    //dynamic load
    if (this.appSbdHost) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(this.data.component);

      const viewContainerRef = this.appSbdHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      this.data.data['control'] = this.control;
      const instance = (<IDynamicComponent>componentRef.instance);
      instance.data = this.data.data;
      instance.onDataChange();
    }
  }
}

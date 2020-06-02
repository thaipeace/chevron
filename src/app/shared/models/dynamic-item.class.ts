import {OnChanges, Type} from '@angular/core';

export class DynamicItem {
  containerId: string;
  component: Type<any>;

  constructor(public cmp: Type<any>, public data: any = {}) {
    this.containerId = data['containerId'] || null;
    this.component = cmp;
  }
}

export interface IDynamicComponent {
  data: any;
  onDataChange(): void;
}


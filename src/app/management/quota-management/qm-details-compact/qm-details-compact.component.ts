import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from '@shared/services/side-bar.service';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {NgForm} from '@angular/forms';
import {ProductDataService} from '@shared/services/data/product-data.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {ProductModel} from '@shared/models/data.models/terminal/product.model';
import * as _ from 'lodash';
import {QuotaDataService} from '@shared/services/data/quota-data.service';

@Component({
  selector: 'app-qm-details-compact',
  templateUrl: './qm-details-compact.component.html',
  styleUrls: ['./qm-details-compact.component.scss']
})
export class QmDetailsCompactComponent extends DefaultComponent implements OnInit, IDynamicComponent {
  @ViewChild('f') public form: NgForm;
  @Input() data;
  control: SideBarControl = null;
  id: string;
  stationId: string;
  isEditing = false;
  products: ProductModel[];
  availableProducts: ProductModel[];
  selectedProducts: ProductModel[];

  constructor(private _SideBarService: SideBarService,
              private _ProductDataService: ProductDataService,
              private _QuotaDataService: QuotaDataService) {
    super();
    this.addPromises(this._ProductDataService.findSettingAll()
      .then((rs: ProductModel[]) => {
        this.products = rs;
        this.clearData();
      }));
  }

  ngOnInit() {
  }

  onDataChange() {
    if (this.data) {
      if (this.data['control']) {
        this.control = this.data['control'];
      }
      if (this.data['id']) {
        this.id = this.data['id'];
      }
      if (this.data['stationId']) {
        this.stationId = this.data['stationId'];
        console.log(this.stationId);
      }
    }
  }

  close() {
    this._SideBarService.close();
    this.control.fn_close();
  }

  onEdit() {
    this.isEditing = true;
  }

  onCancelEdit() {
    this.isEditing = false;
    // this.generateFormData(this.object);
  }

  onUpdate() {
    /*this._DataService.updateSetting(this.id, this.formDOM, this.coordinates)
      .then((rs) => {
        if (rs) {
          this.isEditing = false;
          this.loadData();
          this._SideBarService.refresh();
        }
      });*/
  }

  clearData() {
    this.availableProducts = this.products.slice();
    this.selectedProducts = [];
  }

  onUpload($event: any) {

  }

  onAdd(item: ProductModel) {
    item['quota'] = {
      monthly: 0,
      remaining: 0,
    };
    this.selectedProducts.push(item);
    _.remove(this.availableProducts, (el) => {
      return el === item;
    });
  }

  onRemove(item: ProductModel) {
    _.remove(this.selectedProducts, (el) => {
      return el === item;
    });
    this.availableProducts.push(item);
    _.orderBy(this.selectedProducts, ['name']);
  }
}

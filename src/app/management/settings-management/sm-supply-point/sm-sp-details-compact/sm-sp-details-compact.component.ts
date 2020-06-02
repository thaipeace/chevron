import {Component, OnInit} from '@angular/core';
import {SmDefaultDetailsCompact} from '@management/settings-management/sm-class/sm-default-details-compact.class';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {SupplyPointDataService} from '@shared/services/data/settings/supply-point-data.service';
import {ProductDataService} from '@shared/services/data/product-data.service';
import * as _ from 'lodash';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-sm-sp-details-compact',
  templateUrl: './sm-sp-details-compact.component.html',
  styleUrls: ['./sm-sp-details-compact.component.scss']
})
export class SmSpDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['SupplyPointName', 'Description'];
  products: ICoordinateModel[];
  selectedProducts: ICoordinateModel[];
  availableProducts: ICoordinateModel[];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _SupplyPointDataService: SupplyPointDataService,
              private _ProductDataService: ProductDataService) {
    super(_DialogService, _SideBarService, _SupplyPointDataService);

    this.addPromises(this._ProductDataService.findSettingAll()
      .then((rs) => {
        this.products = rs;
        this.selectedProducts = [];
      }));
  }

  generateFormData(obj) {
    super.generateFormData(obj);
    Promise.all(this._promises).then(() => {
      this.selectedProducts = _.filter(this.products, (el) => {
        return _.find(obj.products, (item) => el.getId() === item.ProductId);
      });
      this.availableProducts = _.differenceWith(this.products, this.selectedProducts, _.isEqual);
    });
  }

  onAddProduct(item) {
    this.selectedProducts.push(item);
    _.remove(this.availableProducts, (el) => {
      return el === item;
    });
  }

  removeProduct(item: any) {
    _.remove(this.selectedProducts, (el) => {
      return el === item;
    });
    this.availableProducts.push(item);
    _.orderBy(this.availableProducts, ['name']);
  }

  onUpdate() {
    // console.log(this.object);
    this._SupplyPointDataService.deleteProducts(this.id)
      .then(() => {
        let productString = '';
        _.map(this.selectedProducts, (el) => {
          productString += `<productId>${el.getId()}</productId>`;
        });
        this.formDOM.addControl('products', new FormControl(productString));
        super.onUpdate();
      });
  }
}

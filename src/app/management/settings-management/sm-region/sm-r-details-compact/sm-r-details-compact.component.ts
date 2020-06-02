import { Component, OnInit } from '@angular/core';
import { SmDefaultDetailsCompact } from '@management/settings-management/sm-class/sm-default-details-compact.class';
import { TerminalModel } from '@shared/models/data.models/terminal/terminal.model';
import { SupplyPointModel } from '@shared/models/data.models/terminal/supply-point.model';
import { TruckRateModel } from '@shared/models/data.models/terminal/truck-rate.model';
import { DialogService } from '@shared/services/others/dialog.service';
import { SideBarService } from '@shared/services/side-bar.service';
import { RegionDataService } from '@shared/services/data/settings/region-data.service';
import { TerminalDataService } from '@shared/services/data/settings/terminal-data.service';
import { ProductDataService } from '@shared/services/data/product-data.service';
import { SupplyPointDataService } from '@shared/services/data/settings/supply-point-data.service';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { DataUtilService } from '@app/shared/services/data-util.service';

@Component({
  selector: 'app-sm-r-details-compact',
  templateUrl: './sm-r-details-compact.component.html',
  styleUrls: ['./sm-r-details-compact.component.scss']
})
export class SmRDetailsCompactComponent extends SmDefaultDetailsCompact {
  keys: string[] = ['RegionName', 'Description', 'AssociatedTerminalId'];
  terminals: TerminalModel[];
  selectedTerminal: TerminalModel;
  supplyPoints: SupplyPointModel[];
  selectedSupplyPoints: SupplyPointModel[];
  availableSupplyPoints: SupplyPointModel[];
  truckRates: TruckRateModel[];

  constructor(
    public _DialogService: DialogService,
    public _SideBarService: SideBarService,
    public _RegionDataService: RegionDataService,
    private _TerminalDataService: TerminalDataService,
    private _ProductDataService: ProductDataService,
    private _SupplyPointDataService: SupplyPointDataService,
    private dataUtilService: DataUtilService
  ) {
    super(_DialogService, _SideBarService, _RegionDataService);

    this.addPromises(
      this._TerminalDataService.findSettingAll()
        .then((rs: TerminalModel[]) => {
          console.log(rs);
          this.terminals = rs;
        }),
      this._SupplyPointDataService.findSettingAll()
        .then((rs: SupplyPointModel[]) => {
          this.supplyPoints = rs;
        }));

  }

  generateFormData(obj) {
    super.generateFormData(obj);
    Promise.all(this._promises).then(() => {
      this.selectedTerminal = _.find(this.terminals, (el) => el.getId() === this.formDOM.get('AssociatedTerminalId').value);
      this.formDOM.get('AssociatedTerminalId').setValue(!!this.selectedTerminal ? this.selectedTerminal.getId() : '');
      this.selectedSupplyPoints = _.filter(this.supplyPoints, (el) => {
        return _.find(obj.supplyPoints, (sp) => el.getId() === sp.SupplyPointId);
      });
      this.availableSupplyPoints = _.differenceWith(this.supplyPoints, this.selectedSupplyPoints, _.isEqual);
      this.truckRates = _.map(this.object['truckRates'].slice(), (el) => new TruckRateModel(el._data));
      // console.log(this.selectedSupplyPoints);
      // console.log(this.object);
      // console.log(this.truckRates);
    });
  }

  onUpdate() {
    //check currency
    if (this.truckRates.length && _.every(this.truckRates, (el) => {
      return this.testCurrency(el.currency);
    })) {
      return;
    }
    let supplyPointQueries = '';
    _.map(this.selectedSupplyPoints, (el) => {
      supplyPointQueries += `<supplypointID>${el.getId()}</supplypointID>`;
    });
    this.formDOM.addControl('supplyPoints', new FormControl(supplyPointQueries));

    let truckRateQueries = '';
    _.map(this.truckRates, (el) => {
      truckRateQueries += el.toQueries();
    });
    this.formDOM.addControl('truckRates', new FormControl(truckRateQueries));

    this._RegionDataService.deleteSupplyPoint(this.id)
      .then(() => {
        this._RegionDataService.deleteTruckRate(this.id)
          .then(() => {
            super.onUpdate();
          });
      });
  }

  onAddSP(item) {
    this.selectedSupplyPoints.push(item);
    _.remove(this.availableSupplyPoints, (el) => {
      return el === item;
    });

    this.selectedSupplyPoints.forEach(spt => {
      if (spt.products.length) {
        spt.products[0].Product = this.dataUtilService.wrapObjToOneElementArray(spt.products[0].Product);
      }
    })
    console.log(this.selectedSupplyPoints);
  }

  removeSP(item: any) {
    _.remove(this.selectedSupplyPoints, (el) => {
      return el === item;
    });
    this.availableSupplyPoints.push(item);
    _.orderBy(this.availableSupplyPoints, ['name']);
  }

  onNewTruckRate() {
    this.truckRates.push(new TruckRateModel());
  }

  removeTT(index: number) {
    this.truckRates.splice(index, 1);
  }

  testCurrency(currency: string) {
    const regex = new RegExp('^[A-Za-z]+$');
    return !regex.test(currency);
  }
}

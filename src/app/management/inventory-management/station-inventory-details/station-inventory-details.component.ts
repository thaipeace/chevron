import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {StaticDataService} from '@shared/services/data/static-data.service';
import {MatSnackBar} from '@angular/material';
import {StationInventoryService} from '@app/shared/services/station-inventory.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {StationDataService} from '@shared/services/data/station-data.service';
import * as _ from 'lodash';
import {GET_COLOR_BY_PRODUCTCODE} from '@shared/constants/value.constant';
import {TankModel} from '@shared/models/data.models/tank/tank.model';

@Component({
  selector: 'app-station-inventory-details',
  templateUrl: './station-inventory-details.component.html',
  styleUrls: ['./station-inventory-details.component.scss']
})
export class StationInventoryDetailsComponent implements OnInit, OnChanges {
  @Input() station: StationModel;
  @Input() type = '';
  @Input() prefix = '';
  @Input() inventoryByProduct;
  @Input() inventoryByTank;
  @Input() isShowByProduct = true;

  // productItems: IHashObject<string>;
  // productCodes: string[];
  hasNoData = false;
  tanks: TankModel[] = [];
  products: TankModel[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private _stationInventoryService: StationInventoryService,
    private _staticDataService: StaticDataService,
    private _StationDataService: StationDataService
  ) {
  }

  ngOnInit() {
    // this._staticDataService.getProductStaticData()
    //   .then(data => {
    //     this.productItems = {};
    //     data.forEach(item => {
    //       this.productItems[item.StaticData.key] = item.StaticData.value;
    //     });
    //   });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.station) {
      this._resetValue();
      if (this.inventoryByProduct && this.inventoryByTank) {
        this.tanks = this.inventoryByTank;
        this.products = this.inventoryByProduct;
        if (!this.isShowByProduct) {
          if (this.tanks.length === 0) {
            this.hasNoData = true;
          } else {
            _.map(this.tanks, (el) => this.generateChartOfTank(el));
          }

        } else {
          if (this.products.length === 0) {
            this.hasNoData = true;
          } else {
            _.map(this.products, (el) => this.generateChartOfProduct(el));
          }
        }
      }
    }
  }

  private _resetValue() {
    // this.productItems = {};
    // this.productCodes = [];
    this.tanks = [];
    this.products = [];
    this.hasNoData = false;
  }

  private generateChartOfTank(el) {

    const plotBandRange = [
      [0, el.deadStock],
      [el.deadStock, el.preferredMaxFill],
      [el.preferredMaxFill, el.maxFillCapacity],
      [el.maxFillCapacity, el.tankCapacity]
    ];
    el.chart = {
      name: `${this.prefix}chart_${this.station.getId()}_${el.tankNumber}_${el.productCode}`,
      title: el.productCode,
      subtitle: `Tank ${el.tankNumber}`,
      unit: 'Litres',
      min: 0,
      max: el.tankCapacity,
      value: el.currentVolume,
      valueName: 'Current Inventory',
      random: false,
      plotBandRange: plotBandRange,
      color: GET_COLOR_BY_PRODUCTCODE(el.productCode)
    };
    if (0 <= el.deadStock && el.deadStock <= el.preferredMaxFill && el.preferredMaxFill <= el.maxFillCapacity
      && el.maxFillCapacity <= el.tankCapacity) {
      el.chart.hasError = false;
    } else {
      el.chart.hasError = true;
    }
  }

  private generateChartOfProduct(el) {
    el.DeadStock = parseInt(el.DeadStock);
    el.MinThreshold = parseInt(el.MinThreshold);
    el.MaxFillCapacity = parseInt(el.MaxFillCapacity);
    el.TotalCapacity = parseInt(el.TotalCapacity);

    const plotBandRange = [
      [0, el.DeadStock],
      [el.DeadStock, el.MinThreshold],
      [el.MinThreshold, el.MaxFillCapacity],
      [el.MaxFillCapacity, el.TotalCapacity]
    ];
    el.chart = {
      name: `${this.prefix}chart_${this.station.getId()}_${el.ProductCode}`,
      title: el.ProductCode,
      unit: 'Litres',
      min: 0,
      max: parseInt(el.TotalCapacity),
      value: parseInt(el.CurrentQuantity),
      valueName: 'Current Inventory',
      random: false,
      plotBandRange: plotBandRange,
      color: GET_COLOR_BY_PRODUCTCODE(el.ProductCode)
    };
    if (0 <= el.DeadStock && el.DeadStock <= el.MinThreshold && el.MinThreshold <= el.MaxFillCapacity && el.MaxFillCapacity <= el.TotalCapacity) {
      el.chart.hasError = false;
    } else {
      el.chart.hasError = true;
    }
    // console.log(plotBandRange);
    // console.log(el.chart.hasError);
  }

  /*private renderInventory(products: ProductModel[]) {
    const array = [];
    _.map(products, (el: ProductModel) => {
      const deadStock = el.deadStock;
      const minThreshold = el.minThreshold;
      const maxFillCapacity = el.maxFillCapacity;
      const totalCapacity = el.totalCapacity;
      const plotBandRange =
        deadStock < minThreshold
          ? [
            [0, deadStock],
            [deadStock, minThreshold],
            [minThreshold, maxFillCapacity],
            [maxFillCapacity, totalCapacity]
          ]
          : [
            [0, minThreshold],
            [minThreshold, deadStock],
            [minThreshold, maxFillCapacity],
            [maxFillCapacity, totalCapacity]
          ];
      array.push({
        name: `${this.prefix}chart_${el.productCode}_${this.type}_${el.stationId}`,
        title: el.productCode,
        unit: 'Litres',
        min: 0,
        max: el.totalCapacity,
        value: el.totalQuantity,
        valueName: 'Current Inventory',
        random: false,
        plotBandRange: plotBandRange,
        color: GET_COLOR_BY_PRODUCTCODE(el.productCode)
      });
    });

    this.productCodes = array;
  }*/
}

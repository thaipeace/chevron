import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {IHashObject} from '@app/shared/models/interfaces/generic-types.interface';
import {MatPaginator, MatSnackBar} from '@angular/material';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {UtilsService} from '@app/shared/services/utils.service';
import {
  X_BUTTON,
  NOTIFICATION_DEFAULT_DURARION
} from '@app/shared/constants/value.constant';
import {CmStationDetailsDialogComponent} from '@app/management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import * as _ from 'lodash';

import {CustomerService} from '@app/shared/services/customer.service';
import {StationDataService} from '@app/shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {CustomerStationModel} from '@app/shared/models/data.models/customer/customer-station.model';
import {StationInventoryService} from '@app/shared/services/station-inventory.service';
import {AuthenticationService} from '@app/user-management/shared/services';
import {UpdateInventoryDialogComponent} from '@app/routes/customer/dialogs/update-inventory-dialog.component';

@Component({
  selector: 'app-im-current',
  templateUrl: './im-current.component.html',
  styleUrls: ['./im-current.component.scss']
})
export class ImCurrentComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  stations: StationModel[] = [];
  selectedStation: CustomerStationModel;
  displayedStations: StationModel[] = [];
  // inventoryFilterDate: Date[] = [new Date(), new Date()];
  // inventoryStationControl = new FormControl();
  // dicStationName: IHashObject<string>;
  inventoryByStation: IHashObject<any>;
  // expansionInventoryGroupByStation: IHashObject<IHashObject<boolean>>;
  selectedStationIds: string[] = [];
  // inventoryChartDataByStation: IHashObject<IChartColumnLineDailyModel>;
  // selectedTanks: any;
  // pendingStations: StationModel[] = [];
  // userRoleName: string = '';
  showByProductCode = true;
  inventoryData;

  paginationOptions = {
    pageIndex: 0,
    length: 100,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25]
  };

  constructor(
    private _customerService: CustomerService,
    private _snackBar: MatSnackBar,
    private _DialogService: DialogService,
    private _StationDataService: StationDataService,
    private _stationInventoryService: StationInventoryService,
    private _AuthenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this._StationDataService.stationAllObservable
      .subscribe(rs => {
        if (rs === null) {
          this._StationDataService.findAll();
        } else {
          this.stations = rs;
          this.selectedStationIds = rs.map(el => {
            return el.sysId;
          });
          this.displayedStations = [...this.stations];
          this.paginationOptions.length = this.displayedStations.length;
          setTimeout(() => {
            this.onPaginationChange();
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  // async loadInventory(stationIds: string[]) {
  //   if (!stationIds.length) {
  //     this.displayedStations = [];
  //     this.paginationOptions.length = this.displayedStations.length;
  //   }
  //
  //   let stationIdString = stationIds.join(', ');
  //
  //   this._StationDataService.findMultipleStation(stationIdString).then(res => {
  //     this.displayedStations = [...res];
  //     this.paginationOptions.length = this.displayedStations.length;
  //   });
  // }

  /*toggleStationRows(stationIds: string[], isExpand) {
    stationIds.forEach((stationId: string) => {
      if (!!this.expansionInventoryGroupByStation[stationId]) {
        this.expansionInventoryGroupByStation[stationId].isExpand = isExpand;
      }
    });
  }

  getPageList(pagination: any) {
    return new Array(Math.ceil(pagination.total / pagination.pageSize));
  }

  getDisplayedItem(array: any[], pagination) {
    const displayedItems = array.slice(
      pagination.pageSize * pagination.currentPage,
      pagination.pageSize * (pagination.currentPage + 1)
    );
    return displayedItems;
  }

  getCurrentPageInfo(pagination: any) {
    const startIndex = pagination.pageSize * pagination.currentPage;
    const endIndex = startIndex + pagination.pageSize;
    const total = pagination.total;
    return `${total === 0 ? 0 : startIndex + 1} - ${
      endIndex > total ? total : endIndex
    } of ${total}`;
  }*/

  isEmpty() {
    return (
      !!this.inventoryByStation &&
      UtilsService.isEmptyObj(this.inventoryByStation)
    );
  }

  onStationDetails(station: StationModel) {
    this._DialogService.open(CmStationDetailsDialogComponent, {
      id: station.getId(),
      readonly: false
    });
  }

  onStationSelectionChange(newV: any) {
    this.selectedStationIds = newV;
    this.displayedStations = _.filter(this.stations, (el) => this.selectedStationIds.indexOf(el.getId()) >= 0);
    this.paginationOptions.length = this.displayedStations.length;
    if ((this.paginator.pageIndex + 1) * this.paginator.pageSize > this.paginator.length) {
      this.paginator.firstPage();
    }
    this.onRefresh();
  }

  onRefresh() {
    // this.paginator.firstPage();
    // this.loadInventory(this.selectedStationIds);
    this.onPaginationChange();
  }

  //Update inventory by UpdateInventoryDialog

  selectStation(selectedStationModel: StationModel) {
    let self = this;
    let stationId = selectedStationModel.sysId;
    this._customerService.getStationsByStationId(stationId).then(res => {
      let stations: CustomerStationModel[] = res;
      self.selectedStation = stations[0];
      self.openEditDialog(selectedStationModel);
    });
  }

  openEditDialog(selectedStationModel: StationModel): void {
    if (
      !this.selectedStation ||
      !this.selectedStation.stationTanks ||
      this.selectedStation.stationTanks.length === 0
    ) {
      return;
    }
    const openingDialogRef = this._DialogService.open(
      UpdateInventoryDialogComponent,
      {
        station: this.selectedStation
      }
    );

    openingDialogRef.afterClosed().subscribe(data => {
      if (!!data) {
        const {tanks, comment} = data;
        if (!!tanks && !!comment) {
          this._stationInventoryService
            .updateTankInventory(
              this.selectedStation.getId(),
              tanks,
              comment,
              this._AuthenticationService.getUsername()
            )
            .then(result => {
              if (!!result && !!result[1]) {
                this._snackBar.open(result[1]['Station']['Message'], X_BUTTON, {
                  duration: NOTIFICATION_DEFAULT_DURARION
                });
              }
              // this.loadInventory(this.selectedStationIds);
              this.onRefresh();
            });
        }
      }
    });
  }

  /*showStatus(event) {
    console.log(event);
  }*/

  onChangeShowBy($event: any) {
    this.showByProductCode = !this.showByProductCode;
  }

  onPaginationChange() {
    // console.log(this.paginator);
    if (!this.stations.length) {
      return;
    }
    const $index = this.paginator.pageIndex;
    const $size = this.paginator.pageSize;
    const ids = this.selectedStationIds.filter((el, index) => {
      if (index >= $index * $size && index < ($index + 1) * $size) {
        return el;
      }
    });
    // console.log(ids);
    if (!ids.length) {
      this.inventoryData = [];
    } else {
      this._StationDataService.findCurrentInventoryByStationIds(ids)
        .then((rs) => {
          // console.log(rs);
          this.inventoryData = rs;
        });
    }

  }
}

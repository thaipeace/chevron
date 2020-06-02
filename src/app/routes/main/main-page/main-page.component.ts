import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {TerminalDataService} from '@shared/services/data/settings/terminal-data.service';
import * as _ from 'lodash';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {RegionDataService} from '@shared/services/data/settings/region-data.service';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {SmTDetailsCompactComponent} from '@management/settings-management/sm-terminal/sm-t-details-compact/sm-t-details-compact.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent extends DefaultComponent {
  terminals: ICoordinateModel[] = [];
  selectedTerminals: ICoordinateModel[] = [];
  selectedTerminalIds: string[] = [];

  regions: ICoordinateModel[] = [];
  selectedRegions: ICoordinateModel[] = [];
  selectedRegionIds: string[] = [];

  stations: StationModel[] = [];
  selectedStations: StationModel[] = [];
  selectedStationIds: string[] = [];

  boundPoints: GeoPoint[];

  constructor(private _TerminalDataService: TerminalDataService,
              private _RegionDataService: RegionDataService,
              private _StationDataService: StationDataService,
              private _SideBarService: SideBarService) {
    super();

    this.addSubscribes(this._StationDataService.stationAllObservable.subscribe((rs) => {
      if (rs) {
        if (rs.length) {
          this.stations = rs;
          this.selectedStations = this.stations.slice();
          this.selectedStationIds = _.map(this.selectedStations, (el) => el.getId());
        }
      } else {
        this._StationDataService.findAll();
      }
    }));

    this._TerminalDataService.findSettingAll()
      .then((rs) => {
        this.terminals = rs;
        this.selectedTerminals = this.terminals.slice();
        this.selectedTerminalIds = _.map(this.selectedTerminals, (el) => el.getId());
        this.boundPoints = [];
        _.map(this.terminals, (el) => {
          this.boundPoints = this.boundPoints.concat(el.coordinates.slice());
        });
      });

    this._RegionDataService.findSettingAll()
      .then((rs) => {
        this.regions = rs;
        this.selectedRegions = this.regions.slice();
        this.selectedRegionIds = _.map(this.selectedRegions, (el) => el.getId());
      });
  }

  ngOnInit() {

  }

  /**
   * on toggle hint
   * @param $event
   */
  onShowHint($event) {
    // console.log($event);
    this.onShowHint = $event;
  }

  onChangeTerminal($event: any) {
    this.selectedTerminalIds = $event;
    this.selectedTerminals = _.filter(this.terminals, (el) => this.selectedTerminalIds.indexOf(el.getId()) !== -1);
    this._SideBarService.close();
  }

  onChangeRegion($event: any) {
    this.selectedRegionIds = $event;
    this.selectedRegions = _.filter(this.regions, (el) => this.selectedRegionIds.indexOf(el.getId()) !== -1);
    this._SideBarService.close();
  }

  onChangeStation($event: any) {
    this.selectedStationIds = $event;
    this.selectedStations = _.filter(this.stations, (el) => this.selectedStationIds.indexOf(el.getId()) !== -1);
    this._SideBarService.close();
  }
}

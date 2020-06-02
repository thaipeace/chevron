import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {NguiMapComponent} from '@ngui/map';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {GeoPoint} from '@shared/models/geo-point.model';
import {MapService} from '@shared/services/map.service';
import * as _ from 'lodash';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {RegionModel} from '@shared/models/data.models/terminal/region.model';
import {TerminalModel} from '@shared/models/data.models/terminal/terminal.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {SideBarService} from '@shared/services/side-bar.service';
import {DynamicItem} from '@shared/models/dynamic-item.class';
import {SmTDetailsCompactComponent} from '@management/settings-management/sm-terminal/sm-t-details-compact/sm-t-details-compact.component';
import {SmRDetailsCompactComponent} from '@management/settings-management/sm-region/sm-r-details-compact/sm-r-details-compact.component';

@Component({
  selector: 'app-mpm-all',
  templateUrl: './mpm-all.component.html',
  styleUrls: ['./mpm-all.component.scss']
})
export class MpmAllComponent extends DefaultMapClass implements OnInit, OnChanges {
  @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;

  @Input() stations: StationModel[] = [];
  @Input() regions: RegionModel[] = [];
  @Input() terminals: TerminalModel[] = [];
  @Input() boundPoints: GeoPoint[] = [];

  terminalPaths = [];
  regionPaths = [];

  object: ICoordinateModel = null;
  map;
  mapOptions: any;
  hideZoomLevel = 10;

  constructor(private _MapService: MapService,
              private _DialogService: DialogService,
              private _SideBarService: SideBarService) {
    super();
  }

  ngOnInit() {
    this.checkControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {boundPoints} = changes;
    const {regions} = changes;
    const {terminals} = changes;
    const {stations} = changes;

    if (stations && stations.currentValue) {
      console.log(this.stations);
    }

    if (regions && regions.currentValue) {
      if (this.map) {
        _.map(this.regionPaths, (el) => {
          if (!!el) {
            el.setMap(null);
          }
        });
        this.regionPaths = [];
        _.map(this.regions, (el: ICoordinateModel) => {
          this.regionPaths.push(this.renderPolygonFromPoints(el.coordinates));
        });
      }
    }

    if (terminals && terminals.currentValue) {
      if (this.map) {
        _.map(this.terminalPaths, (el) => {
          if (!!el) {
            el.setMap(null);
          }
        });
        this.terminalPaths = [];
        _.map(this.terminals, (el: ICoordinateModel) => {
          this.terminalPaths.push(this.renderPolygonFromPoints(el.coordinates));
        });
      }
    }

    if (boundPoints && boundPoints.currentValue) {
      this.resetMapBounds();
      this.setMapBounds(this.map, boundPoints.currentValue);
    }
  }

  checkControl() {
    this.mapOptions = {
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };
  }

  renderPolygonFromPoints(points: GeoPoint[] = []) {
    let path;
    if (points.length) {
      const coordinates = [];
      _.map(points, el => {
        coordinates.push(el.toPoint());
      });
      path = new google.maps.Polygon({
        paths: coordinates,
        strokeColor: '#2496C9',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#2496C9',
        fillOpacity: 0.33,
        zIndex: 1
      });

      path.setMap(this.map);
    }
    return path;
  }

  onMapReady(map) {
    this.map = map;
    console.log('init map');

    if (this.boundPoints) {
      this.resetMapBounds();
      this.setMapBounds(this.map, this.boundPoints);
    }

  }

  onZoomChange($event) {
    this.zoom = $event.target.zoom;
  }

  onClickTerminal(item: TerminalModel) {
    this._SideBarService.open(new DynamicItem(SmTDetailsCompactComponent, {'id': item.getId(), readonly: true}));
  }

  onClickRegion(item: RegionModel) {
    this._SideBarService.open(new DynamicItem(SmRDetailsCompactComponent, {'id': item.getId(), readonly: true}));
  }

  onClickStation(item: StationModel) {
    this._DialogService.open(CmStationDetailsDialogComponent, {'id': item.getId()});
  }
}

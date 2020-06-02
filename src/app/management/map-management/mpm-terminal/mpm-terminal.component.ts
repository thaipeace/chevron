import {Component, DoCheck, EventEmitter, Input, KeyValueDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DefaultMapClass} from '@shared/models/default/default-component.model';
import {DrawingManager, NguiMapComponent} from '@ngui/map';
import {MapService} from '@shared/services/map.service';
import {GeoPoint} from '@shared/models/geo-point.model';
import * as _ from 'lodash';
import {CoordinateModel, ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';

@Component({
  selector: 'app-mpm-terminal',
  templateUrl: './mpm-terminal.component.html',
  styleUrls: ['./mpm-terminal.component.scss']
})
export class MpmTerminalComponent extends DefaultMapClass implements OnInit, OnChanges {
  @ViewChild(NguiMapComponent) nguiMapComponent: NguiMapComponent;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  @Input() readonly: boolean = false;
  @Input() drawable: boolean = false;
  @Input() maxPoint: number = 1;
  @Input() editableObject: ICoordinateModel = null;
  @Input() groups: ICoordinateModel[] = [];
  @Input() points: GeoPoint[] = [];
  @Input() boundPoints: GeoPoint[] = [];
  @Output() onPointChange = new EventEmitter<ICoordinateModel>();
  @Output() onPointClick = new EventEmitter<ICoordinateModel>();

  object: ICoordinateModel = null;
  map;
  mapOptions: any;
  overlay;
  coordinates: GeoPoint[] = [];
  centerBounds: GeoPoint[] = [];

  constructor(private _MapService: MapService) {
    super();
  }

  ngOnInit() {
    this.checkControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {readonly} = changes;
    const {groups} = changes;
    const {editableObject} = changes;
    const {points} = changes;
    const {boundPoints} = changes;
    if (!!readonly) {
      this.checkControl();
    }

    if (points && points.currentValue) {
      console.log(points.currentValue);
      const coordinateModel = new CoordinateModel();
      coordinateModel.coordinates = points.currentValue;
      this.object = coordinateModel;
      if (this.map) {
        this.replacePolygon(this.object);
        if (this.readonly) {
          this.resetMapBounds();
          this.setMapBounds(this.map, this.object.coordinates);
        }
      }
    }

    if (editableObject && editableObject.currentValue) {
      this.object = Object.assign({}, this.editableObject);
      if (this.map) {
        this.replacePolygon(this.object);
        if (this.readonly) {
          this.resetMapBounds();
          this.setMapBounds(this.map, this.object.coordinates);
        }
      }
    }

    if (groups && groups.currentValue) {
      console.log(groups);
      if (this.map) {
        _.map(this.groups, (el: ICoordinateModel) => {
          this.renderPolygonFromPoints(el.coordinates);
        });
      }
    }

    if (boundPoints && boundPoints.currentValue) {
      this.resetMapBounds();
      this.setMapBounds(this.map, boundPoints.currentValue);
    }
  }

  checkControl() {
    if (!this.readonly) {
      this.mapOptions = {
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        fullscreenControl: true
      };
    } else {
      this.mapOptions = {
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };
    }
  }

  replacePolygon(object: ICoordinateModel) {

    this.coordinates = [];
    if (object.coordinates.length) {
      this.coordinates = object.coordinates.slice();
    }
    if (this.overlay) {
      this.overlay.setMap(null);
    }
    const path = this.renderPolygonFromPoints(object.coordinates);
    this.overlay = path;
    this.renderCenterBound(this.getCenterOfArray(object.coordinates));

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
    if (this.object) {
      this.replacePolygon(this.object);
      this.setMapBounds(this.map, this.object.coordinates);
    }

    if (this.groups.length) {
      _.map(this.groups, (el: ICoordinateModel) => {
        this.renderPolygonFromPoints(el.coordinates);
      });
    }

    if (this.boundPoints) {
      this.resetMapBounds();
      this.setMapBounds(this.map, this.boundPoints);
    }

    if (this.drawable) {
      this.drawingManager['initialized$'].subscribe(dm => {
        google.maps.event.addListener(dm, 'overlaycomplete', event => {
          if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            dm.setDrawingMode(null);
            if (this.overlay) {
              this.overlay.setMap(null);
            }
            this.overlay = event.overlay;
            // google.maps.event.addListener(event.overlay, 'click', e => {
            // });
            const array: GeoPoint[] = [];
            _.map(this.overlay.getPath().getArray(), (el) => {
              array.push(new GeoPoint(el.lat(), el.lng()));
            });
            this.object.coordinates = array;
            this.coordinates = array.slice();
            this.object.centerBound = this.getCenterOfArray(array);
            this.renderCenterBound(this.object.centerBound);
            this.onPointChange.emit(this.object);
          }
        });
      });
    }
  }

  renderCenterBound(point: GeoPoint) {
    this.centerBounds = [];
    if (point) {
      this.centerBounds.push(point);
    }

    // setTimeout(() => {

    // });
  }

  onZoomChange($event) {
    this.zoom = $event.target.zoom;
  }

  onClick(group: ICoordinateModel) {
    this.onPointClick.emit(group);
  }
}

import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, HostListener} from '@angular/core';
import {GeoPoint} from '@shared/models/geo-point.model';
import * as _ from 'lodash';
import {DialogService} from '@shared/services/others/dialog.service';
import {ToastService} from '@shared/services/others/toast.service';

@Component({
  selector: 'app-table-geo-small',
  templateUrl: './table-geo-small.component.html',
  styleUrls: ['./table-geo-small.component.scss']
})
export class TableGeoSmallComponent implements OnInit, OnChanges {
  @ViewChild('uploadInput') uploadInput: ElementRef<HTMLElement>;
  @Input() points: GeoPoint[];
  @Input() styleClass: string;
  @Input() maxPoint: number = null;
  @Input() isEditing: boolean = false;
  @Output() onPointChange = new EventEmitter<GeoPoint[]>();
  coordinates: GeoPoint[];

  constructor(private _DialogService: DialogService,
              private _ToastService: ToastService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    const {points} = changes;
    if (points && points.currentValue) {
      this.coordinates = this.points.slice();
    }
  }

  onNew() {
    this.coordinates = this.coordinates.filter(c => c.lat && c.lng);
    if (!!this.maxPoint && this.coordinates.length >= this.maxPoint) {
      this._ToastService.openSimple(`Max number of available points is ${this.maxPoint}`);
    } else {
      this.coordinates.push(new GeoPoint());
    }

  }

  remove(index: number) {
    this.coordinates.splice(index, 1);
    this.onPointChange.emit(this.coordinates);
  }

  loadData($event: MouseEvent) {
    //clear cache to fix cannot choose same file again
    this.uploadInput.nativeElement['value'] = '';
    this.uploadInput.nativeElement.click();
  }

  clearData() {
    this.onPointChange.emit([new GeoPoint(null, null)]);
  }

  onInputChange($event, point: GeoPoint) {
    // console.log(point);
    // console.log(this.points);
    if (point.hasPosition()) {
      this.onPointChange.emit(this.coordinates);
    }
  }

  downloadTemplate() {
    if (window) {
      window.open('./assets/files/template/geo-points.csv', '_blank');
    }
  }

  onClickToUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.onFileChange(fileInput.target.files[0]);
    }
  }

  onFileChange(file: any) {
    const self = this;
    const fileTypes = ['csv'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (fileTypes.indexOf(extension) < 0) {
      this._DialogService.alert('Only accept file types: ' + fileTypes.toString());
      return;
    }

    if (file.size >= 4194304) {
      this._DialogService.alert('Maximum file size is 4MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e: any) {
      try {
        let base64 = e.target.result.split(',')[1];
        // console.log(base64);
        // console.log(atob(base64));
        base64 = atob(base64);
        while (base64.charAt(base64.length - 1) === '\n') {
          base64 = base64.replace(/\n$/, '');
        }
        const array = base64.split('\n');
        const pointArray = [];
        _.map(array, (el) => {
          const obj = el.split(',');
          pointArray.push(new GeoPoint(parseFloat(obj[0]), parseFloat(obj[1])));
        });
        self.coordinates = pointArray;
        self.onPointChange.emit(self.coordinates);
      } catch (e) {
        self._DialogService.alert(e);
      }
    };

    reader.readAsDataURL(file);
  }

  // @HostListener('mouseenter')
  // clickInside() {
  //   this.wasInside = true;
  // }

  @HostListener('mouseleave')
  clickout() {
    this.coordinates = this.coordinates.filter(c => c.lat && c.lng);
    this.onPointChange.emit(this.coordinates);
  }
}

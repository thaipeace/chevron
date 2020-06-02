import {DefaultComponent} from '@shared/models/default/default-component.model';
import {Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {GeoPoint} from '@shared/models/geo-point.model';
import {DialogService} from '@shared/services/others/dialog.service';
import {SideBarService} from '@shared/services/side-bar.service';
import {SettingsDataService} from '@shared/services/data/settings/settings-data.service';
import {MpmEditableCoordinateDialogComponent} from '@management/map-management/mpm-editable-coordinate-dialog/mpm-editable-coordinate-dialog.component';
import * as _ from 'lodash';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {noWhitespaceValidator} from '@shared/validators/no-white-spaces';

export class SmDefaultDetailsCompact extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
  @ViewChild('f') public form: NgForm;
  @Input() data;
  @Input() readonly: boolean = false;
  formDOM: FormGroup;
  control: SideBarControl = null;

  keys: string[] = [];

  id: string;
  object: ICoordinateModel;
  isEditing = false;
  coordinates: GeoPoint[];

  constructor(public _DialogService: DialogService,
              public _SideBarService: SideBarService,
              public _DataService: SettingsDataService) {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onDataChange() {
    if (this.data) {
      if (this.data['control']) {
        this.control = this.data['control'];
      }
      if (this.data['readonly']) {
        this.readonly = this.data['readonly'];
      }
      if (this.data['id']) {
        this.id = this.data['id'];
        this.loadData();
      }
    }
  }

  loadData() {
    this._DataService.findSettingById(this.id)
      .then((rs: any) => {
        if (rs) {
          // console.log(rs);
          this.object = rs;
          this.generateFormData(this.object);
        }
      });
  }

  generateFormData(obj) {
    const groups = {};
    _.map(this.keys, (el) => {
      return groups[el] = new FormControl(obj.getValue(el) || '', [Validators.required, noWhitespaceValidator]);
    });
    this.formDOM = new FormGroup(groups);
    this.coordinates = !!obj.coordinates ? obj.coordinates.slice() : [];

  }

  close() {
    this._SideBarService.close();
    this.control.fn_close();
    this.unsubscribeAll();
  }

  onCoordinateChange($event: any) {
    this.coordinates = $event;
  }

  onCoordinateOpenDialog() {
    this._DialogService.open(MpmEditableCoordinateDialogComponent,
      {
        points: this.coordinates,
        onChange: ($event) => this.onCoordinateChange($event),
        readonly: !this.isEditing,
        drawable: this.isEditing
      });
  }

  onEdit() {
    this.isEditing = true;
  }

  onCancelEdit() {
    this.isEditing = false;
    this.generateFormData(this.object);
  }

  onUpdate() {
    this._DataService.updateSetting(this.id, this.formDOM, this.coordinates)
      .then((rs) => {
        if (rs) {
          this.isEditing = false;
          this.loadData();
          this._SideBarService.refresh();
        }
      });
  }
}

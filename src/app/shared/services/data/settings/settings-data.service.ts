import {ApiService} from '@shared/services/api.service';
import {ErrorHandlerService} from '@shared/services/error-handler.service';
import {Payload} from '@shared/models/payload.model';
import {UtilsService} from '@shared/services/utils.service';
import {ICoordinateModel} from '@shared/models/data.models/interface-coordinate.model';
import {Type} from '@angular/core';
import * as _ from 'lodash';
import {FormGroup} from '@angular/forms';
import {GeoPoint} from '@shared/models/geo-point.model';

export class SettingsDataService {
  KEY: string;
  settingPayloads = {};
  settingPayloadKeys = {
    SETTING_FIND_ALL: 'setting_find_all',
    SETTING_FIND_BY_ID: 'setting_find_by_id',
    SETTING_DELETE: 'setting_delete',
    SETTING_DELETE_GEO_POINTS: 'setting_delete_geo_points',
    SETTING_UPDATE: 'setting_update',
    SETTING_CREATE: 'setting_create',
  };

  constructor(public _ApiService: ApiService,
              public _ErrorHandlerService: ErrorHandlerService,
              private payloadInput: any,
              private objectModelClass: Type<ICoordinateModel>) {
    this.KEY = new this.objectModelClass().KEY;
    this.settingPayloads = {
      [this.settingPayloadKeys.SETTING_FIND_ALL]:
        new Payload(payloadInput.FIND_ALL),
      [this.settingPayloadKeys.SETTING_FIND_BY_ID]:
        new Payload(payloadInput.FIND_BY_ID),
      [this.settingPayloadKeys.SETTING_DELETE]:
        new Payload(payloadInput.DELETE),
      [this.settingPayloadKeys.SETTING_DELETE_GEO_POINTS]:
        payloadInput.DELETE_GEO_POINTS ? new Payload(payloadInput.DELETE_GEO_POINTS) : null,
      [this.settingPayloadKeys.SETTING_UPDATE]:
        new Payload(payloadInput.UPDATE),
      [this.settingPayloadKeys.SETTING_CREATE]:
        new Payload(payloadInput.CREATE),
    };
  }

  findSettingAll(): Promise<ICoordinateModel[]> {
    return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_FIND_ALL])
      .then((raw) => {
        if (this._ErrorHandlerService.handleMessage(raw) && raw.data['APIResponse'][`${this.KEY}s`]) {
          let array = raw.data['APIResponse'][`${this.KEY}s`][this.KEY];
          array = UtilsService.isArray(array) ? array : [array];
          return _.map(array, (el) => new this.objectModelClass(el));
        }
        return [];
      });
  }

  findSettingById(id: string): Promise<ICoordinateModel> {
    return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_FIND_BY_ID], [id])
      .then((raw) => {
        if (this._ErrorHandlerService.handleMessage(raw)) {
          return new this.objectModelClass(raw.data['APIResponse'][this.KEY]);
        }
        return null;
      });
  }

  delete(id: string): Promise<any> {
    return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_DELETE], [id])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }

  async deleteSettingGeoPoints(id: string): Promise<any> {
    if (this.settingPayloads[this.settingPayloadKeys.SETTING_DELETE_GEO_POINTS]) {
      return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_DELETE_GEO_POINTS], [id])
        .then((rs) => this._ErrorHandlerService.handleMessage(rs));
    }
  }

  async updateSetting(id: string, formGroup: FormGroup, points: GeoPoint[]) {
    await this.deleteSettingGeoPoints(id);

    let attributesQuery = '';
    _.map(Object.keys(formGroup.controls), (el) => {
      attributesQuery += `<${el}>${formGroup.controls[el].value}</${el}>`;
    });

    // geolocations
    points = _.filter(points, (el: GeoPoint) => el.hasPosition());
    let pointQuery = '';
    _.map(points, (el) => {
      pointQuery += el.toSettingQueryString();
    });

    return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_UPDATE], [id, attributesQuery, pointQuery])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }

  async createSetting(formGroup: FormGroup) {

    let attributesQuery = '';
    _.map(Object.keys(formGroup.controls), (el) => {
      attributesQuery += `<${el}>${formGroup.controls[el].value}</${el}>`;
    });

    return this._ApiService.findRaw(this.settingPayloads[this.settingPayloadKeys.SETTING_CREATE], [attributesQuery])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }
}

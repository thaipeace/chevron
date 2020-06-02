import * as moment from 'moment';
import * as _ from 'lodash';
import {MappingLabelPipe} from '../../pipe/mapping-label.pipe';
import {GeoPoint} from '@shared/models/geo-point.model';
import {UtilsService} from '@shared/services/utils.service';

export interface ITQLFormData {
    toInputPlaceHolder(key: string);

    setValue(key, value);

    getValue(key);

    updateValues(_data);
}

export class TQLFormData implements ITQLFormData {
    constructor(_data: any = {}) {
        for (let key of Object.keys(_data)) {
            this[key] = _data[key];
            if (!this[key].value) {
                this[key].value = '';
            }
            if (!this[key].hidden) {
                this[key].hidden = false;
            }
            if (!this[key].type) {
                this[key].type = 'string';
            }
        }
    }

    updateValues(_data) {
        for (let key of Object.keys(this)) {
            this[key].value = _data[key];
            //check parent
            if (this[key]['parent']) {
                this[key].value = _data[this[key]['parent']][key];
            }
        }
    }

    setValue(key, value) {
        if (this[key]) {
            this[key].value = value;
        } else {
            this[key] = {
                'value': value
            };
        }
    }

    getValue(key) {
        if (this[key]) {
            return this[key].value;
        }
        return null;
    }

    getTimeValue(key) {
        return (new Date(this.getValue(key))).getTime();
    }


    toInputPlaceHolder(key: string) {
        let str = 'Enter ';
        if (this[key]) {
            str += new MappingLabelPipe().transform(key);
        }
        return str;
    }
}

export interface IDefaultObject {
    _data: any;
}

export interface IDefaultObjectConstructor {
    new(_data: any): IDefaultObject;
}

export class DefaultObject implements IDefaultObject {
    _data = {};
    _dataLabel = {};
    _raw = {};
    _idKey: string = null;
    coordinates;

    constructor(_data: any = {}, idKey: string = null) {
        if (_data) {
            this._raw = _data;
            for (let key of Object.keys(_data)) {
                this._data[key] = _data[key];
                this.formatData(key, this._data);
            }
        }

        if (idKey) {
            this._idKey = idKey;
        }
    }

    isId(id) {
        return this.compareByDataKey(this._idKey, id);
    }

    getId() {
        if (this._idKey && this._data[this._idKey]) {
            return this._data[this._idKey];
        }
        return null;
    }

    getIdKey() {
        return this._idKey || '';
    }

    getValue(key: string) {
        return this._data[key];
    }

    getLabel(key: string) {
        return this._dataLabel[key] || this._data[key];
    }

    getRawValue(key: string) {
        return this._raw[key];
    }

    setValue(key: string, value: any) {
        return this._data[key] = value;
    }

    setLabel(key: string, label: any) {
        return this._dataLabel[key] = label;
    }

    setRawValue(key: string, value: any) {
        return this._raw[key] = value;
    }


  /**
   * massage data base on key
   * @param key
   * key of data
   * @param data
   * parent data contains all keys and values
   */
    formatData(key, data) {
        if (data[key]) {
            switch (key) {
                case 'lastLoggedIn':
                case 'estimatedTime':
                case 'createDate':
                case 'lastUpdated':
                case 'LastUpdated':
                case 'deliveredTime':
                case 'readingTime':
                case 'startTime':
                case 'endTime':
                case 'scheduleTime':
                case 'statusChangeTime':
                case 'scheduledTimeFrom':
                case 'scheduledTimeTo':
                    data[key] = moment(parseInt(data[key])).format('YYYY-MM-DD (HH:mm)');
                    break;
                case 'CreatedAt':
                case 'LastSeen':
                    data[key] = moment(data[key]).format('YYYY-MM-DD (HH:mm)');
                    break;
                case 'StartDate':
                case 'EndDate':
                    data[key] = moment(parseInt(data[key])).format('YYYY-MM-DD');
                    break;
                case 'geoPoint':
                case 'startGeoPoint':
                case 'endGeoPoint':
                    if (data[key]['latitude'] && data[key]['longitude']) {
                        data[key] = new GeoPoint(data[key]['latitude'], data[key]['longitude']);
                    } else {
                        data[key] = null;
                    }
                    break;
                case 'terminalPassExpiryDate':
                case 'safeLoadingPassDate':
                    data[key] = moment(parseInt(data[key])).format('YYYY-MM-DD');
                    break;
            }
        } else {
            data[key] = null;
        }

    }

    compareByDataKey(key, value) {
        if (this._data[key]) {
            return this._data[key] === value;
        }
        return false;
    }

    toFormData() {
        let obj = new TQLFormData();
        if (this['__proto__']['constructor']['_dataKeys']) {
            obj = _.cloneDeep(this['__proto__']['constructor']['_dataKeys']);
        }
        obj.updateValues(this._data);
        return obj;
    }

    generateGeofenPoints(){
      this.coordinates = [];
      let geoPoints = this.getValue('GeofencePoints');
      if (!!geoPoints && geoPoints['Geopoint']) {
        geoPoints = geoPoints['Geopoint'];
        geoPoints = UtilsService.isArray(geoPoints) ? geoPoints : [geoPoints];

        this.coordinates = [];
        _.map(geoPoints, (el) => {
          this.coordinates.push(new GeoPoint(el['Latitude'], el['Longitude']));
        });
      }
    }

    static getFormData(): TQLFormData {
        if (this.hasOwnProperty('_dataKeys')) {
            return _.cloneDeep(this['_dataKeys']);
        }
        return new TQLFormData();
    }
}

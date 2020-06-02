import {Injectable} from '@angular/core';
import {PayloadsConstant} from '@shared/constants/payloads.constant';
import {Payload} from '@shared/models/payload.model';
import {ApiService} from '@shared/services/api.service';
import {StationProductInventoryHistoryModel} from '@shared/models/data.models/inventory/station-product-inventory-history.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ToastService} from '@shared/services/others/toast.service';
import {UtilsService} from '@shared/services/utils.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {ErrorHandlerService} from '@shared/services/error-handler.service';

const payloadInventory = PayloadsConstant.INVENTORY;
const PAYLOAD_KEYS = {
  FIND_PREDICTION: 'find_prediction',
  FIND_HISTORICAL_INVENTORY_OF_STATION: 'find_historical_inventory_of_station',
  COUNT_HISTORICAL_INVENTORY_OF_STATION: 'count_historical_inventory_of_station',
  FILE_UPLOAD_BY_DATE: 'file_upload_by_date',
  IMPORT_FILE: 'import_file',
  GET_IMPORT_FILE: 'get_import_file',
  IMPORT_DATA: 'import_data',
};

@Injectable({
  providedIn: 'root'
})
export class InventoryDataService {
  payloads = {};

  constructor(private apiService: ApiService,
              private _ToastService: ToastService,
              private _ErrorHandlerService: ErrorHandlerService) {
    this.payloads = {
      [PAYLOAD_KEYS.FIND_PREDICTION]:
        new Payload(payloadInventory.FIND_PREDICTION, null, null),
      [PAYLOAD_KEYS.FIND_HISTORICAL_INVENTORY_OF_STATION]:
        new Payload(payloadInventory.GET_INVENTORY_BY_STATION, payloadInventory.OBJECT_FIND_HISTORY, StationProductInventoryHistoryModel),
      [PAYLOAD_KEYS.COUNT_HISTORICAL_INVENTORY_OF_STATION]:
        new Payload(payloadInventory.COUNT_INVENTORY_BY_STATION),
      [PAYLOAD_KEYS.FILE_UPLOAD_BY_DATE]:
        new Payload(payloadInventory.FILE_UPLOAD_BY_DATE),
      [PAYLOAD_KEYS.IMPORT_FILE]:
        new Payload(payloadInventory.IMPORT_FILE),
      [PAYLOAD_KEYS.GET_IMPORT_FILE]:
        new Payload(payloadInventory.GET_IMPORT_FILE_CONTENT),
      [PAYLOAD_KEYS.IMPORT_DATA]:
        new Payload(payloadInventory.IMPORT_DATA),
    };
  }

  findPrediction(id): Promise<any> {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FIND_PREDICTION], [id]);
  }

  findHistoricalInventoryOfStation(stationId: string, startDate: number, endDate: number): Promise<StationProductInventoryHistoryModel[]> {
    return this.apiService.find(this.payloads[PAYLOAD_KEYS.FIND_HISTORICAL_INVENTORY_OF_STATION],
      [stationId, startDate, endDate]);
  }

  countHistoricalInventoryOfStation(stationId: string, startDate: number, endDate: number,): Promise<any> {
    return this.apiService.findCount(this.payloads[PAYLOAD_KEYS.COUNT_HISTORICAL_INVENTORY_OF_STATION],
      [stationId, startDate, endDate]);
  }

  fileUploadByDate(date: Date) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.FILE_UPLOAD_BY_DATE],
      [moment(date).format('DD/MM/YYYY')]);
  }

  fileUpload(data: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.IMPORT_FILE], [data])
      .then((rs) => {
        console.log(rs);
        if (rs['data']['APIResponse']['Message']) {
          this._ToastService.openSimple(rs['data']['APIResponse']['Message']);
        }
        if (rs['data']['APIResponse']['Status'] === 'Success') {
          return rs['data']['APIResponse']['FileName'];
        }
        return null;
      });
  }

  getFileUploadContent(fileName: string, date: string) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.GET_IMPORT_FILE], [fileName, date])
      .then((rs) => {
        console.log(rs);
        /*
        * data:
Response:
Stations:
Message: ""
Station
        * */
        if (this._ErrorHandlerService.handleMessage(rs)) {
          if (rs.data['APIResponse']['Data']['Stations']['Station']) {
            let array = rs.data['APIResponse']['Data']['Stations']['Station'];
            array = UtilsService.isArray(array) ? array : [array];
            return _.map(array, (el) => new StationModel(el));
          }
        }
        return null;
      });
  }

  importData(fileName: string, planned: boolean) {
    return this.apiService.findRaw(this.payloads[PAYLOAD_KEYS.IMPORT_DATA], [fileName, planned])
      .then((rs) => this._ErrorHandlerService.handleMessage(rs));
  }
}

import {Injectable} from '@angular/core';
import {StationDataService} from '@shared/services/data/station-data.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(private _StationDataService: StationDataService) {

  }

  resetAll() {
    this.resetService();
  }

  resetService() {
    this._StationDataService._reset();
  }
}

import {Injectable, EventEmitter} from '@angular/core';
import {Payload} from '../models/payload';
import {PayloadsConstant} from '../constants/payloads.constant';
import {ApiDataService} from './api-data.service';
import {DataUtilService} from './data-util.service';
import {forkJoin} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '@app/store/state/app.state';
import * as ImageActions from 'src/app/store/actions/image.actions';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  public isLoadingParams: boolean = false;
  public paramData: any[] = [];
  public params: EventEmitter<any> = new EventEmitter();

  public isLoadingIcon: boolean = false;
  public iconsData: any[] = [];
  public icons: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _ActivatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {
  }

  getMenuParams() {
    return this._ActivatedRoute.snapshot.queryParams['menu'] || null;
  }

  getRemoteParams() {
    return this._ActivatedRoute.snapshot.queryParams['remote'] === 'true';
  }

  requestAllParams(superAdmin?) {
    let getParamsPayload = new Payload(PayloadsConstant.settings.findAllParams, []);
    return superAdmin
      ? this.apiDataService.executeQueryWithSupperAdmin(getParamsPayload).toPromise()
      : this.apiDataService.executeQuery(getParamsPayload).toPromise();
  }

  async getAllParams(superAdmin?) {
    if (!this.isLoadingParams) {
      this.isLoadingParams = true;
      let res = await this.requestAllParams(superAdmin);
      this.isLoadingParams = false;
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(`<result>${res}</result>`);

      if (raw.result.Paramlist && raw.result.Paramlist.Status !== 'NoResult') {
        this.paramData = this.dataUtilService.wrapObjToOneElementArray(raw.result.Paramlist.Param);
        this.broadcastParams();
      }
    }
  }

  broadcastParams() {
    this.params.emit({params: this.paramData});
  }

  requestAllIcons(superAdmin?) {
    let keys = ['Logo', 'Favicon'];
    if (superAdmin) {
      return forkJoin(
        keys.map(type => {
          const getLogoFavPayload = new Payload(PayloadsConstant.settings.getIcon, [type]);
          return this.apiDataService.executeQueryWithSupperAdmin(getLogoFavPayload);
        })
      );
    } else {
      return forkJoin(
        keys.map(type => {
          const getLogoFavPayload = new Payload(PayloadsConstant.settings.getIcon, [type]);
          return this.apiDataService.executeQuery(getLogoFavPayload);
        })
      );
    }

  }

  async getAllIcons(superAdmin?) {
    let keys = ['logo', 'favicon'];
    this.iconsData.length = 0;
    if (!this.isLoadingIcon) {
      this.isLoadingIcon = true;
      let rs = await this.requestAllIcons(superAdmin);
      this.isLoadingIcon = false;
      
      rs.subscribe(responseList => {
        responseList.forEach((res: string, index) => {
          let rawRes = this.dataUtilService.convertXmlToJson(res);
          if (rawRes.APIResponse && rawRes.APIResponse.Message) {
            this.iconsData.push({type: keys[index], value: rawRes.APIResponse.Message});
            this.store.dispatch(new ImageActions.UpdateImage({base64: rawRes.APIResponse.Message}));
          }
        });
      });      

      // rs.subscribe(responseList => {
      //   responseList.forEach((res: string, index) => {
      //     let rawRes = this.dataUtilService.convertXmlToJson(res);
      //     if (rawRes.APIResponse && rawRes.APIResponse.Message) {
      //       this.iconsData.push({type: keys[index], value: rawRes.APIResponse.Message});
      //     }
      //   });
      //   this.broadcastIcons();
      // });
    }
  }

  broadcastIcons() {
    // this.icons.emit({icons: this.iconsData});
  }

  getLogo() {
    const getLogoFavPayload = new Payload(PayloadsConstant.settings.getIcon, ['Logo']);
    this.apiDataService.executeQueryWithSupperAdmin(getLogoFavPayload).subscribe(res => {
      let rawRes = this.dataUtilService.convertXmlToJson(res);
      if (rawRes.APIResponse && rawRes.APIResponse.Message) {
        this.store.dispatch(new ImageActions.UpdateImage({base64: rawRes.APIResponse.Message}));
      }
    }, error => {
      console.log('Loading error');
    })
  }
}

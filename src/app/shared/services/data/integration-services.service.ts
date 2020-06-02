import { Injectable, EventEmitter } from '@angular/core';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '../api-data.service';
import { DataUtilService } from '../data-util.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationServicesService {

  public isIntegrationServicesLoading: boolean = false;
  public integrationServicesData: any[];
  public integrationServices: EventEmitter<any> = new EventEmitter();
  public summary: any = {};

  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService
  ) { }

  private getSummary() {
    if (this.integrationServicesData === undefined) {
      return {
        count: 0,
        enabled: 0,
        disabled: 0,
        ok: 0,
        error: 0,
        enabledError: 0,
      }
    } else {
      return {
        count: this.integrationServicesData.length,
        enabled: this.integrationServicesData.filter(i => i['Enabled'] === 'true').length,
        disabled: this.integrationServicesData.filter(i => i['Enabled'] === 'false').length,
        ok: this.integrationServicesData.filter(i => i['Status'] !== 'disconnected').length,
        error: this.integrationServicesData.filter(i => i['Status'] === 'disconnected').length,
        enabledError: this.integrationServicesData.filter(i => i['Status'] === 'disconnected' && i['Enabled'] === 'true').length,
      }
    }
    
  }

  requestIntegrationServices(startEndDate) {
    let getArtifactsPayload = new Payload(PayloadsConstant.activityManagement.getAllIntigratedServiceDetails, []);
    return this.apiDataService.executeQuery(getArtifactsPayload).toPromise();
  }

  async getIntegrationServices(startEndDate) {
    if (!this.isIntegrationServicesLoading) {
      this.isIntegrationServicesLoading = true;
      let res = await this.requestIntegrationServices(startEndDate);
      this.isIntegrationServicesLoading = false;

      if (res) {
        let raw = this.dataUtilService.convertXmlToJson(res);
        this.integrationServicesData = raw.APIResponse && raw.APIResponse.Status === 'Success' && raw.APIResponse.ExternalServices
          ? this.dataUtilService.wrapObjToOneElementArray(raw.APIResponse.ExternalServices.ExternalService)
          : [];

        this.summary = this.getSummary();
        this.broadcastIntegrationServices();
      }

    }
  }

  broadcastIntegrationServices() {
    this.integrationServices.emit({ integrationServices: this.integrationServicesData });
  }
}

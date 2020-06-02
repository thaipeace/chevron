import { Component, OnInit } from '@angular/core';
import { Payload } from '@app/shared/models/payload';
import { PayloadsConstant } from '@app/shared/constants/payloads.constant';
import { ApiDataService } from '@app/shared/services/api-data.service';
import { DataUtilService } from '@app/shared/services/data-util.service';
import { MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { ParamsService } from '@app/shared/services/params.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.scss']
})
export class OrganizationProfileComponent implements OnInit {

  settingsDetail: any = {};
  isEditing: boolean = false;
  params: any[] = [];
  paramsValue: any = {};
  formKeys: string[] = [];
  displayFields: string[] = ['Company Name', 'Contact Name', 'Contact Phone', 'Contact Email', 'Contact Address', 'Company Logo URL', 'Support Phone Number', 'Support Email'];

  uploadError: any = {
    logo: '', favicon: ''
  };
  uploadFile: string = null;
  isChanged: any = {
    logo: false, favicon: false
  }
  
  constructor(
    private apiDataService: ApiDataService,
    private dataUtilService: DataUtilService,
    private _snackBar: MatSnackBar,
    private paramsService: ParamsService
  ) {}

  ngOnInit() {
    this.setParams();
    this.setLogoFav();
  }

  setParams() {
    let getParamsPayload = new Payload(PayloadsConstant.settings.findParamsByCategory, ['OrganisationProfile']);
    this.apiDataService.executeQuery(getParamsPayload).subscribe(res => {
      let raw = this.dataUtilService.convertXmlToJsonParseAttributes(res);
      this.params = this.dataUtilService.wrapObjToOneElementArray(raw.Paramlist.Param);
      
      this.params.forEach(p => {
        this.paramsValue[p.sVarId] = p.VarValue;
      });
      this.isEditing = false;
    }, error => {
      console.log('Loading error');
    });
  }

  setLogoFav() {
    this.paramsService.icons.subscribe(result => {
      if (!result.icons.length) return;
      this.settingsDetail.logo = result.icons.find(i => i.type === 'logo').value;
      this.settingsDetail.favicon = result.icons.find(i => i.type === 'favicon').value;
    });
    this.paramsService.broadcastIcons();
    if (!this.paramsService.iconsData || !this.paramsService.iconsData.length) {
      this.paramsService.getAllIcons();
    }
  }

  doUpdate() {
    this.isEditing = false;
    let updateParams = '';
    this.params.forEach(p => {
      updateParams += this.dataUtilService.replaceParams(
        PayloadsConstant.settings.updateParameter, 
        [p.sVarId, p.VarCategory, p.VarName, p.VarDescription, p.VarKeyType, p.VarKey, p.VarValueType, this.paramsValue[p.sVarId]]
      );
    })

    let updateParamsPayload = new Payload(updateParams, []);
    this.apiDataService.executeQuery(updateParamsPayload).subscribe(async res => {
      let raw = this.dataUtilService.convertXmlToJson(`<result>${res}</result>`);
      
      if (raw.result.Status === 'Success') {
        let uploadImageError = false;

        if (this.settingsDetail.logo && this.isChanged.logo) {
          let resUploadFile = await this.doUploadFile(this.settingsDetail.logo, 'Logo');
          let rawUploadFile = this.dataUtilService.convertXmlToJson(resUploadFile);
          uploadImageError = rawUploadFile.APIResponse.Status !== 'Success';
        }

        if (this.settingsDetail.favicon && this.isChanged.favicon) {
          let resUploadFile = await this.doUploadFile(this.settingsDetail.favicon, 'Favicon');
          let rawUploadFile = this.dataUtilService.convertXmlToJson(resUploadFile);
          uploadImageError = rawUploadFile.APIResponse.Status !== 'Success';
        }
        
        if (uploadImageError) {
          this._snackBar.open(`Upload image failed`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION }); 
        } else {
          this._snackBar.open(`Organization Profile updated successfully`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
          this.paramsService.getAllIcons();
        }
        this.paramsService.getAllParams();
      } else {
        this._snackBar.open(`Organization Profile updated failed`, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
      }
      this.setParams();
    }, error => {
      console.log('Loading error');
    });
  }

  doCancel() {
    this.setParams();
    this.setLogoFav();
    this.uploadError = { logo: '', favicon: '' };
  }

  onUpdateFile(id) {
    document.getElementById(id).click();
  }

  onFileChange(fileInput: any, type) {
    let self = this;
    self.uploadError[type] = null;

    let fileTypes = ["png", "jpg", "jpeg"];

    if (fileInput.target.files && fileInput.target.files[0]) {
      let file = fileInput.target.files[0];
      let extension = file.name.split(".").pop().toLowerCase();

      if (fileTypes.indexOf(extension) < 0) {
        self.uploadError[type] = "Only accept file types: " + fileTypes.toString();
        return;
      }

      if (file.size >= 51200) {
        self.uploadError[type] = "Maximum file size is 50KB";
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e: any) {
        self.uploadFile = e.target.result.split(",")[1];
        self.isChanged[type] = true;
        self.settingsDetail[type] = self.uploadFile;
      };
    }
  }

  doUploadFile(file: string, type) {
    let updateImagePayload = new Payload(PayloadsConstant.settings.uploadIcon,[type, file]);
    return this.apiDataService.executeQuery(updateImagePayload).toPromise();
  }

}

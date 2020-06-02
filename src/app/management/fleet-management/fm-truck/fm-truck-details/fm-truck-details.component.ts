import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {TruckModel} from '@shared/models/data.models/fleet/truck.model';
import {TruckDataService} from '@shared/services/data/truck-data.service';
import {TQLFormData} from '@app/shared/models/default/default-object.model';
import {MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {NOTIFICATION_DEFAULT_DURARION, X_BUTTON} from '@shared/constants/value.constant';
import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import {AuthenticationService} from '@app/user-management/shared/services';
import {noWhitespaceValidator} from '@app/shared/validators/no-white-spaces';
import {valueSafeValidator} from '@app/shared/validators/value-safe';
import {forkJoin} from 'rxjs';
import {Payload} from '@app/shared/models/payload';
import {PayloadsConstant} from '@app/shared/constants/payloads.constant';
import {ApiDataService} from '@app/shared/services/api-data.service';
import {DialogService} from '@app/shared/services/others/dialog.service';
import {RegionDataService} from '@shared/services/data/settings/region-data.service';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {RegionModel} from '@shared/models/data.models/terminal/region.model';
import {DistinctPipe} from '@shared/pipe/distinct.pipe'
import * as _ from 'lodash';

@Component({
  selector: 'app-fm-truck-details',
  templateUrl: './fm-truck-details.component.html',
  styleUrls: ['./fm-truck-details.component.scss'],
  providers: [ DistinctPipe ]
})
export class FmTruckDetailsComponent extends DefaultComponent implements OnChanges, OnInit {
  @Input() id;
  @Input() readonly = true;
  @Input() popupEdit = false;
  @Output() refresh = new EventEmitter();
  @Output() showEdit = new EventEmitter();
  @Output() onDetailsChange = new EventEmitter();

  object: TruckModel;
  truckInspectionDocErrors: string[];
  downloadLink: string = '';
  truckForm: FormGroup;
  compartments: FormArray;
  edit = false;
  private regions: RegionModel[];
  private selectedRegions: RegionModel[];
  private availableRegions: RegionModel[];

  constructor(
    private _TruckDataService: TruckDataService,
    private _snackBar: MatSnackBar,
    private _AuthenticationService: AuthenticationService,
    private _ApiDataService: ApiDataService,
    private _DialogService: DialogService,
    private _RegionDataService: RegionDataService,
    private _DistinctPipe: DistinctPipe
  ) {
    super();
    this.truckForm = new FormGroup({
      truckPlate: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
      safeLoadingPassDate: new FormControl('', [Validators.required]),
      totalCapacity: new FormControl('', [Validators.required]),
      isPtoSupported: new FormControl('', [Validators.required]),
      truckState: new FormControl('', [Validators.required]),
      dedicated: new FormControl('', [Validators.required])
    });

    // find all regions
    this.addPromises(this._RegionDataService.findSettingAll()
      .then((rs: RegionModel[]) => {
        // console.log(rs);
        this.regions = rs;
      }));
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const {id} = changes;
    this.edit = false;

    if (!!id && !!id.currentValue) {
      this.loadDetails();
    }
  }

  loadDetails() {
    const promise = Promise.all(this._promises).then(() => {
      return this._TruckDataService.findById(this.id).then(rs => {
        this.object = rs;
        // console.log(rs);
        this.downloadLink = this.object.getValue('downloadLink');
        Object.keys(this.truckForm.controls).forEach(key => this.truckForm.get(key).setValue(rs[key]));
        if (rs._data['compartment']) {
          this.compartments = new FormArray(
            Array.from(rs._data['compartment']).map(
              compartment => new FormControl(compartment['capacity'], [Validators.required])
            )
          );
        } else {
          this.compartments = new FormArray([]);
        }
        this.onDetailsChange.emit(this.object);
        // console.log(this.object);
        // console.log(this.regions);
        this.availableRegions = this.regions.slice();
        this.selectedRegions = [];
        if (this.object.regions.length) {
          this.selectedRegions = _.filter(this.availableRegions, (el: RegionModel) => {
            const found = _.filter(this.object.regions, (region) => el.getId() === region['regionId']);
            if (!!found && found.length) {
              const ids = _.map(found, (item) => item['productId']);
              el.setProducts(ids);
            }
            el.products = this._DistinctPipe.transform(el.products, 'name');
            el.selectedProducts = this._DistinctPipe.transform(el.selectedProducts, 'name');
            return !!found && found.length;
          });
          this.availableRegions = _.differenceWith(this.availableRegions, this.selectedRegions, _.isEqual);
        }
      });
    });

    this.refresh.emit(promise);
  }

  onSave() {
    const formData: TQLFormData = TruckModel.getFormData();
    formData.updateValues(this.object._data);

    if (this.truckForm.valid) {
      Object.keys(this.truckForm.controls).forEach(key => formData.setValue(key, this.truckForm.get(key).value));
      formData.setValue('isPtoSupported', this.truckForm.get('isPtoSupported').value === 'yes' ? true : false);
      formData.setValue('dedicated', this.truckForm.get('dedicated').value === 'yes' ? true : false);

      const safeVal = new Date(formData['safeLoadingPassDate'].value);
      formData.setValue('safeLoadingPassDate', safeVal.getTime());

      /*delete then update dedicated regions*/
      this._TruckDataService.deleteAllDedicatedRegion(this.id)
        .then(() => {
          return this._TruckDataService.updateDedicatedRegion(this.id, this.selectedRegions);
        })
        .then(() => {
          this._TruckDataService.update(this.id, formData, this._AuthenticationService.getUsername()).then(async rs => {
            if (rs && rs[1] && rs[1]['Update']['Status'] === 'Success') {
              await this.updateCompartments();
              this.edit = false;
              this.loadDetails();
              const message = `${formData.getValue('truckPlate')} is updated successfully`;
              this._snackBar.open(message, X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
              this._DialogService.emitOutput(null, 'FmTruckDetailsDialogComponent');
            } else {
              if (rs && rs[1] && rs[1]['Update']['Message']) {
                const message = rs[1]['Update']['Message'];
                this._snackBar.open(message, X_BUTTON, {
                  duration: NOTIFICATION_DEFAULT_DURARION
                });
              } else {
                const message = `There are some problems. Please try again!`;
                this._snackBar.open(message, X_BUTTON, {
                  duration: NOTIFICATION_DEFAULT_DURARION
                });
              }
            }
          });
        });

    } else {
      const message = `There are some problems. Please try again!`;
      this._snackBar.open(message, X_BUTTON, {
        duration: NOTIFICATION_DEFAULT_DURARION
      });
    }
  }

  onEdit() {
    this.edit = true;
  }

  onCancelEdit() {
    this.edit = false;
    Object.keys(this.truckForm.controls).forEach(key => this.truckForm.get(key).setValue(this.object[key]));
  }

  onChangedIsPtoSupported(event) {
    this.truckForm.get('isPtoSupported').setValue(event.value);
  }

  onChangedDedicated(event) {
    this.truckForm.get('dedicated').setValue(event.value);
  }

  onFileChange(fileInput: any) {
    const self = this;
    self.truckInspectionDocErrors = [];
    const fileTypes = ['pdf'];

    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const extension = file.name
        .split('.')
        .pop()
        .toLowerCase(); // file extension from input file

      if (fileTypes.indexOf(extension) < 0) {
        self.truckInspectionDocErrors.push('Only accept file types: ' + fileTypes.toString());
        return;
      }

      if (file.size >= 716800) {
        self.truckInspectionDocErrors.push('Maximum file size is 700KB');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e: any) {
        self.uploadFile(e.target.result.split(',')[1]);
      };
    }
  }

  uploadFile(file: string) {
    const formData = new TQLFormData();
    formData.setValue('Base64Data', file);
    formData.setValue('truckPlate', this.object.truckPlate);
    this._TruckDataService.uploadDriverDoc(formData).then(rs => {
      this._snackBar.open(rs[1].Response, X_BUTTON, {
        duration: NOTIFICATION_DEFAULT_DURARION
      });
      this.loadDetails();
    });
  }

  onDownload() {
    if (window) {
      window.open(this.downloadLink, '_blank');
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (this.popupEdit) {
      tabChangeEvent.index === 0 ? this.showEdit.emit(true) : this.showEdit.emit(false);
    }
  }

  selectionChange(event) {
    this.truckForm.get('truckState').setValue(event.value);
  }

  enableUpdate() {
    return this.truckForm.valid && this.compartments.valid;
  }

  updateCompartments() {
    return forkJoin(
      this.compartments.value.map((capacity, index) => {
        const updateCompartmentPayload = new Payload(PayloadsConstant.TRUCK.UPDATE_TRUCK_COMPARTMENT,
          [this.truckForm.get('truckPlate').value, index + 1, capacity]
        );
        return this._ApiDataService.executeQuery(updateCompartmentPayload);
      })
    ).toPromise();
  }

  removeRegion(item: RegionModel) {
    item.resetProducts();
    _.remove(this.selectedRegions, (el) => {
      return el === item;
    });
    this.availableRegions.push(item);
    _.orderBy(this.selectedRegions, ['name']);
  }

  onAddRegion(item: RegionModel) {
    item.products = this._DistinctPipe.transform(item.products, 'name');
    item.selectedProducts = this._DistinctPipe.transform(item.selectedProducts, 'name');
    this.selectedRegions.push(item);
    _.remove(this.availableRegions, (el) => {
      return el === item;
    });
  }
}

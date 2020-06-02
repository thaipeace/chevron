import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { NgForm, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';
import { CustomerModel } from '@app/shared/models/data.models/customer/customer.model';
import { CustomerDataService } from '@shared/services/data/customer-data.service';
import { AuthenticationService } from '@app/user-management/shared/services';
import { StationModel } from '@app/shared/models/data.models/station/station.model';
import { StationDataService } from '@app/shared/services/data/station-data.service';
import { TankModel } from '@app/shared/models/data.models/tank/tank.model';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { emailValidator } from '@app/shared/validators/email';
import { telPhoneValidator } from '@app/shared/validators/telPhone';
import { MapPickupDialogComponent } from '@app/shared/components/map/map-pickup-dialog/map-pickup-dialog.component';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { TankDataService } from '@app/shared/services/data/tank-data.service';
import { MessageQuestionDialogComponent } from '@app/shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import { DialogService } from '@app/shared/services/others/dialog.service';
import { resolve } from 'dns';

@Component({
    selector: 'app-cm-customer-new',
    templateUrl: './cm-customer-new.component.html',
    styleUrls: ['./cm-customer-new.component.scss']
})
export class CmCustomerNewComponent extends DefaultDialogComponent implements OnInit {
    @ViewChild('f') public form: NgForm;

    contactNumberControls: FormArray = new FormArray([]);
    customerDetail: CustomerModel;
    customerId: string;
    customers: CustomerModel[];
    customerSoldTo: any[] = [];
    formData: TQLFormData;
    formStationData: TQLFormData;
    formTankData: TQLFormData;
    isCollapsed: boolean = false;
    isLoadCustomer = false;
    isNew: boolean;
    isStationExtend: boolean = false;
    selectedIndex = -1;
    soldToError: boolean = false;
    stationDetail: StationModel;
    stations: any[] = [];
    stationShipTo: any[] = [];
    tanks: any[] = [];
    rfCustomer: FormGroup;
    rfStationList: FormGroup[] = [];

    viewCustomerKeys: string[] = ['customerName', 'contactNumber', 'customerAddress', 'emailAddress', 'soldTo'];
    viewStationKeys: string[] = [
        'stationName',
        'shortName',
        'streetAddress',
        'stationType',
        'contactNumber',
        'distanceFromTerminal',
        'estimatedHoursFromTerminal',
        'shipTo',
        'truckSize'
    ];
    viewTankKeys: string[] = [
        'tankNumber',
        'deadStock',
        'maxFillCapacity',
        'currentUllage',
        'currentVolume',
        'maxFillCapacityPercentage',
        'isPtoReq',
        'productCode',
        'tankCapacity'
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { customerDetail: CustomerModel },
        private _AuthenticationService: AuthenticationService,
        private _CustomerDataService: CustomerDataService,
        private _MatSnackBar: MatSnackBar,
        private _StationDataService: StationDataService,
        public dialogRef: MatDialogRef<CmCustomerNewComponent>,
        private _tankService: TankDataService,
        private _DialogService: DialogService
    ) {
        super(dialogRef);
        const { customerDetail } = data;
        this.customerDetail = customerDetail;
    }

    ngOnInit() {
        this.formData = CustomerModel.getFormData();
        this.selectedIndex = -1;

        this.rfCustomer = new FormGroup({
            customerName: new FormControl('', [Validators.required, noWhitespaceValidator]),
            contactNumber: new FormControl('', [Validators.required, noWhitespaceValidator, telPhoneValidator]),
            customerAddress: new FormControl('', [Validators.required, noWhitespaceValidator]),
            emailAddress: new FormControl('', [Validators.required, noWhitespaceValidator, emailValidator]),
            soldTo: new FormControl('', [Validators.required])
        });

        this.addSubscribes(
            this._CustomerDataService.customerAllObservable.subscribe(rs => {
                if (rs == null) {
                    this._CustomerDataService.findAll();
                } else {
                    this.customerSoldTo = rs.map(el => {
                        return el.soldTo;
                    });
                }
            }),
            this._StationDataService.stationAllObservable.subscribe(rs => {
                if (rs == null) {
                    this._StationDataService.findAll();
                } else {
                    this.stationShipTo = rs.map(el => {
                        return el.shipTo;
                    });
                }
            })
        );
    }

    async doUpdate() {
        this.soldToError = false;
        if (this.customerSoldTo.indexOf(this.formData.getValue('soldTo')) !== -1) {
            this.soldToError = true;
            return;
        }

        const listNameStation = this.rfStationList.map(station => station.get('stationName').value);

        this.checkNoExist(this.rfCustomer.get('customerName').value, listNameStation).then(condition => {
            if (condition) {
                this.reactiveToFormData(this.rfCustomer, this.formData);

                console.log(this.formData);
                console.log(this.rfCustomer.value);
                this.rfStationList.forEach((station, i) => {
                    console.log(station);
                    console.log(this.stations[i]);
                });

                this._CustomerDataService.create(this.formData, this._AuthenticationService.getUsername()).then(rs => {
                    if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
                        let customerId = rs[1]['Create']['Customer']['sysId'];
                        if (this.stations.length) {
                            this.stations.forEach(async (station, index) => {
                                station.setValue('customerId', customerId);
                                station.setValue(
                                    'estimatedHoursFromTerminal',
                                    station.getValue('estimatedHoursFromTerminal').valueOf()
                                );
                                await this.createStation(station, this.rfStationList[index]);
                            });
                        } else {
                            this.onCancel();
                        }
                        const message = `Create successfully`;
                        this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                        // this.dialogRef.close(true);
                    } else {
                        if (rs && rs[1] && rs[1]['Create']['Message']) {
                            const message = rs[1]['Create']['Message'];
                            this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                        } else {
                            const message = `There are some problems. Please try again!`;
                            this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                        }
                    }
                });
            }
        });

        // this.formData.setValue('contactNumber', this.contactNumberControls.getRawValue().join(','));
        // this._stationService.create(this.formData, this._authenService.getUsername()).then(rs => {
        //   if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
        //     const message = `Create successfully`;
        //     this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        //     this.dialogRef.close(true);
        //   } else {
        //     if (rs && rs[1] && rs[1]['Create']['Message']) {
        //       const message = rs[1]['Create']['Message'];
        //       this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        //     } else {
        //       const message = `There are some problems. Please try again!`;
        //       this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
        //     }
        //   }
        // });
    }

    createStation(station, rfStation: FormGroup) {
        this.reactiveToFormData(rfStation, station);
        this._StationDataService.create(station, this._AuthenticationService.getUsername()).then(rs => {
            console.log(rs);
            if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
                // if (this.stations.length) {
                //   this.stations.forEach((station) => {
                //     this.createStation(station);
                //   })
                // }
                console.log(station['rfTanks']);
                if (Array.isArray(station['rfTanks']) && station['rfTanks'].length > 0) {
                    station['rfTanks'].forEach(async tank => {
                        const formData = TankModel.getFormData();
                        this.reactiveToFormData(tank, formData);

                        if (formData.getValue('isPtoReq')) {
                            formData.setValue('isPtoReq', false);
                        }

                        formData.setValue('stationId', rs[1]['Create']['Station']['sysId']);
                        await this.createTank(formData);
                    });
                } else {
                    this.onCancel();
                }
                const message = `Create successfully`;
                this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                // this.dialogRef.close(true);
            } else {
                if (rs && rs[1] && rs[1]['Create']['Message']) {
                    const message = rs[1]['Create']['Message'];
                    this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                } else {
                    const message = `There are some problems. Please try again!`;
                    this._MatSnackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
                }
            }
        });
    }

    checkNoExist(CustomerName: string, stationNames: string[]) {
        if (stationNames.length != Array.from(new Set(stationNames)).length) {
            this._DialogService.open(MessageQuestionDialogComponent, {
                question: 'Duplicate Station!',
                type: 'close'
            });

            return new Promise(resolve => false);
        }

        return this._CustomerDataService.isNoExistName(CustomerName).then(rs => {
            return rs
                ? this._StationDataService.findAllOfListName(stationNames).then(result => {
                      let listName = result
                          .filter(station => stationNames.includes(station._data['stationName']))
                          .map(station => station._data['stationName']);
                      let message = `Station: ${listName.reduce((rs, name) => `${rs} "${name}" `, '')}`;
                      message = message + 'is Existed!';

                      if (listName.length)
                          this._DialogService.open(MessageQuestionDialogComponent, {
                              question: message,
                              type: 'close'
                          });
                      return listName.length == 0 ? true : false;
                  })
                : (() => {
                      this._DialogService.open(MessageQuestionDialogComponent, {
                          question: `Custiomer "${CustomerName}" is Existed!`,
                          type: 'close'
                      });

                      return false;
                  })();
        });
    }

    createTank(tank) {
        this._tankService.create(tank, this._AuthenticationService.getUsername()).then(rs => {
            if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
                const message = `Create successfully`;
                this._MatSnackBar.open(message, X_BUTTON, {
                    duration: NOTIFICATION_DEFAULT_DURARION
                });
                this.onCancel();
            } else {
                if (rs && rs[1] && rs[1]['Create']['Message']) {
                    const message = rs[1]['Create']['Message'];
                    this._MatSnackBar.open(message, X_BUTTON, {
                        duration: NOTIFICATION_DEFAULT_DURARION
                    });
                } else {
                    const message = `There are some problems. Please try again!`;
                    this._MatSnackBar.open(message, X_BUTTON, {
                        duration: NOTIFICATION_DEFAULT_DURARION
                    });
                }
            }
        });
    }

    onCancel() {
        this.dialogRef.close(true);
    }

    addStation() {
        let station = StationModel.getFormData();

        this.stations.forEach(element => {
            element['selected'] = false;
            element['isCollapse'] = true;
        });

        station['selected'] = true;
        station['isCollapse'] = false;
        station['tanks'] = [];
        station['rfTanks'] = [];
        station['contactNumber'] = new FormArray([]);

        let rfstation = new FormGroup({
            stationName: new FormControl(`${this.stations.length + 1}`, [
                Validators.required,
                noWhitespaceValidator,
                valueSafeValidator
            ]),
            shortName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            streetAddress: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            stationType: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
            contactNumber: new FormArray([]),
            distanceFromTerminal: new FormControl('', [Validators.required]),
            estimatedHoursFromTerminal: new FormControl('', [Validators.required]),
            shipTo: new FormControl('', [Validators.required]),
            truckSize: new FormControl('', [Validators.required])
        });

        this.selectedIndex = this.stations.length;
        this.stations.push(station);
        this.rfStationList.push(rfstation);
    }

    addTank() {
        let tank = TankModel.getFormData();
        tank['isCollapse'] = true;

        let rfTank = new FormGroup({
            tankNumber: new FormControl(`${this.stations[this.selectedIndex]['tanks'].length + 1}`, [
                Validators.required,
                Validators.min(0)
            ]),
            deadStock: new FormControl('', [Validators.required, Validators.min(0)]),
            maxFillCapacity: new FormControl('', [Validators.required, Validators.min(0)]),
            currentUllage: new FormControl('', [Validators.required, Validators.min(0)]),
            currentVolume: new FormControl('', [Validators.required, Validators.min(0)]),
            maxFillCapacityPercentage: new FormControl('', [
                Validators.required,
                Validators.max(100),
                Validators.min(0)
            ]),
            isPtoReq: new FormControl(''),
            productCode: new FormControl('', [Validators.required]),
            tankCapacity: new FormControl('', [Validators.required])
        });

        this.stations[this.selectedIndex]['tanks'].push(tank);
        this.stations[this.selectedIndex]['rfTanks'].push(rfTank);
    }

    removeStation(index: number) {
        this.stations.splice(index, 1);
        this.rfStationList.splice(index, 1);
        this.selectedIndex -= 1;
    }

    removeTank(index: number) {
        this.stations[this.selectedIndex]['tanks'].splice(index, 1);
        this.stations[this.selectedIndex]['rfTanks'].splice(index, 1);
    }

    addContactNumberControl(i): void {
        this.stations[i]['contactNumber'].controls.push(new FormControl('', [Validators.required]));
    }

    canAddNewContactNumber(i): boolean {
        return this.stations[i]['contactNumber'].controls.length > 4;
    }

    selectStation(i) {
        this.stations.forEach((element, index) => {
            if (index == i) {
                return;
            }
            element['selected'] = false;
            element['isCollapse'] = true;
        });
        this.stations[i]['selected'] = true;
        this.selectedIndex = i;
    }

    checkValidForm() {
        return (
            this.rfStationList.filter((rfStation, index) => {
                return (
                    this.stations[index]['rfTanks'].filter(rfTank => rfTank.invalid).length != 0 || rfStation.invalid
                );
            }).length == 0 && this.rfCustomer.valid
        );
    }

    reactiveToFormData(reactiveForm: FormGroup, formData: TQLFormData) {
        Object.keys(reactiveForm.controls).forEach(key => {
            if (Array.isArray(reactiveForm.get(key).value)) {
                formData.setValue(key, Array(reactiveForm.get(key).value).join(', '));
            } else {
                formData.setValue(key, reactiveForm.get(key).value);
            }
        });
    }
}

import { Component, OnInit, ViewChild, Input, EventEmitter, Output, OnChanges, Inject } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { UserManagementModel } from '@shared/models/data.models/user-management.model';
import { UserService, RoleService } from '@app/user-management/shared/services';
import { TQLFormData } from '@shared/models/default/default-object.model';
import { RoleModel } from '@app/user-management/shared/models/data.models/role.model';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
	X_BUTTON,
	NOTIFICATION_DEFAULT_DURARION,
	NOTIFICATION_CREATION_DURARION
} from '@shared/constants/value.constant';
import { TruckCompanyDataService } from '@shared/services/data/truck-company-data.service';
import { TruckCompanyModel } from '@shared/models/data.models/fleet/truck-company.model';
import { DEFAULT_ROLES } from '@app/user-management/shared/models/data.models/user.model';
import { StationDataService } from '@shared/services/data/station-data.service';
import { StationModel } from '@shared/models/data.models/station/station.model';
import { CustomerStationUserMappingModel } from '@shared/models/data.models/customer/customer-station-user-mapping.model';
import * as _ from 'lodash';
import { TruckCompanyUserMappingModel } from '@app/shared/models/data.models/fleet/truck-company-user-mapping.model';
import { emailValidator } from '@app/shared/validators/email';
import { noWhitespaceValidator } from '@app/shared/validators/no-white-spaces';
import { valueSafeValidator } from '@app/shared/validators/value-safe';
import { DefaultDialogComponent } from '@shared/models/default/default-component.model';

@Component({
	selector: 'app-um-new',
	templateUrl: './um-new.component.html',
	styleUrls: ['./um-new.component.scss']
})
export class UmNewComponent extends DefaultDialogComponent implements OnInit {
	@ViewChild('f') public form: NgForm;
	//   @Input() userDetail: UserManagementModel;
	//   @Input() roles: RoleModel[] = [];
	//   @Output() updateUserSuccess = new EventEmitter<any>();
	userDetail: UserManagementModel;
	roles: RoleModel[] = [];

	userKeys: string[] = ['firstName', 'lastName', 'emailId', 'roleId'];
	userEditKeys: string[] = ['firstName', 'lastName', 'emailId', 'roleId'];
	keys: string[];
	isNew = false;
	formData: TQLFormData;
	userForm: FormGroup;
	truckCompanies: TruckCompanyModel[] = [];

	selectedTruckCompanies: TruckCompanyModel[] = [];
	deselectedTruckCompanies: TruckCompanyModel[] = [];
	truckCompaniesMapping: TruckCompanyUserMappingModel[] = [];

	stations: StationModel[] = [];
	selectedStations: StationModel[] = [];
	deselectedStations: StationModel[] = [];

	DEFAULT_ROLES = DEFAULT_ROLES;

	constructor(
		private _userService: UserService,
		private _roleService: RoleService,
		private _snackBar: MatSnackBar,
		private _TruckCompanyDataService: TruckCompanyDataService,
		private _StationDataService: StationDataService,
		public dialogRef: MatDialogRef<UmNewComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { userDetail: UserManagementModel; roles: RoleModel[] }
	) {
		super(dialogRef);
		const { userDetail, roles } = data;
		this.userDetail = userDetail;
		this.roles = this._roleService.roleLabelFormat(roles);
	}

	ngOnInit() {
		this.formData = UserManagementModel.getFormData();

		if (!this.userDetail) {
			this.isNew = true;
			this.keys = this.userKeys;
		} else {
			this.isNew = false;
			this.formData = UserManagementModel.getFormData();
			this.formData.updateValues(this.userDetail._data);
			this.keys = this.userEditKeys;
		}

		this.userForm = new FormGroup({
			firstName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
			lastName: new FormControl('', [Validators.required, noWhitespaceValidator, valueSafeValidator]),
			emailId: new FormControl('', [Validators.required, noWhitespaceValidator, emailValidator]),
			roleId: new FormControl('', [Validators.required])
		});

		this.loadTruckCompany();

		this._StationDataService.stationAllObservable.subscribe(rs => {
			this.stations = rs;
			this.loadAssociatedStation();
		});
	}

	loadTruckCompany() {
		this._TruckCompanyDataService.findAll().then(rs => {
			this.truckCompanies = rs;
			this.loadTruckCompanyMapping();
		});
	}

	loadAssociatedStation() {
		if (!this.userDetail || !this.userDetail.userName.length) {
			return;
		}
		this._StationDataService.findAllByUsername(this.userDetail.userName).then(rs => {
			this.selectedStations = rs;

			if (this.stations.length && this.selectedStations.length) {
				_.map(this.selectedStations, el => {
					if (el) {
						let found = _.find(this.stations, e => {
							if (e) {
								return e.sysId === el.sysId;
							}
						});
						if (found) {
							this.stations.splice(this.stations.indexOf(found), 1);
						}
					}
				});
			}
		});
	}

	loadTruckCompanyMapping() {
		if (!this.userDetail || !this.userDetail.userName.length) {
			return;
		}
		return this._TruckCompanyDataService
			.findUserTruckCompanyMappingByUsername(this.userDetail.userName)
			.then(rs => {
				this.truckCompaniesMapping = rs;
				if (this.truckCompanies.length && this.truckCompaniesMapping.length) {
					this.selectedTruckCompanies = [];
					_.map(this.truckCompaniesMapping, el => {
						let found = _.find(this.truckCompanies, e => {
							return e.getId() === el.getValue('truckCompanyId');
						});
						if (found) {
							this.selectedTruckCompanies.push(found);
							this.truckCompanies.splice(this.truckCompanies.indexOf(found), 1);
						}
					});
				}
			});
	}

	doUpdate() {
		Object.keys(this.userForm.controls).forEach(key => this.formData.setValue(key, this.userForm.get(key).value));

		if (this.isNew) {
			this._userService.create(this.formData).then(rs => {
				if (rs && rs[1] && rs[1]['Create']['Status'] === 'Success') {
					// add truck company mapping
					///---->>>> No username in response - need to clarify
					// let userName = rs[2]['data']['Save']['User']['userName']['Value'];
					// this.updateStation(userName);
					const message = `New user is created successfully`;
					this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_CREATION_DURARION });
					//this.updateUserSuccess.emit();
					this.dialogRef.close(true);
				} else {
					if (rs && rs[1] && rs[1]['Message']) {
						const message = rs[1]['Message'];
						this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
					} else {
						const message = `There are some problems. Please try again!`;
						this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
					}
				}
			});
		} else {
			this._userService.update(this.formData).then(rs => {
				if (rs && rs[1] && rs[1]['Save']['Status'] === 'Success') {
					let userName = rs[2]['data']['Save']['User']['userName']['Value'];
					this.updateStation(userName);
					const message = `Update successfully`;
					this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
					//this.updateUserSuccess.emit();
					this.dialogRef.close(true);
				} else {
					if (rs && rs[1] && rs[1]['Save']['Message']) {
						const message = rs[1]['Save']['Message'];
						this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
					} else {
						const message = `There are some problems. Please try again!`;
						this._snackBar.open(message, X_BUTTON, { duration: NOTIFICATION_DEFAULT_DURARION });
					}
				}
			});
		}
	}

	updateStation(userName: string) {
		if (
			(this.formData.getValue('roleId') === this.DEFAULT_ROLES.TRUCK_COMPANY_OPERATOR ||
				this.formData.getValue('roleId') === this.DEFAULT_ROLES.TRUCK_COMPANY_OWNER) &&
			this.selectedTruckCompanies
		) {
			let arrayOfSelectedItems: TruckCompanyUserMappingModel[] = [];
			let arrayOfDeselectedItems: TruckCompanyUserMappingModel[] = [];
			_.map(this.selectedTruckCompanies, el => {
				arrayOfSelectedItems.push(
					new TruckCompanyUserMappingModel({
						truckCompanyId: el.getId(),
						userName: userName
					})
				);
			});
			_.map(this.deselectedTruckCompanies, el => {
				arrayOfDeselectedItems.push(
					new TruckCompanyUserMappingModel({
						truckCompanyId: el.getId(),
						userName: userName
					})
				);
			});
			this._TruckCompanyDataService.createMultiUserTruckCompanyMapping(arrayOfSelectedItems).then(() => {
				this._TruckCompanyDataService.deassociateMultiUserTruckCompanyMapping(arrayOfDeselectedItems);
			});
		}

		if (this.formData.getValue('roleId') === this.DEFAULT_ROLES.CUSTOMER && this.selectedStations) {
			let arrayOfSelectedItems: CustomerStationUserMappingModel[] = [];
			let arrayOfDeselectedItems: CustomerStationUserMappingModel[] = [];
			_.map(this.selectedStations, el => {
				arrayOfSelectedItems.push(
					new CustomerStationUserMappingModel({
						customerId: el.customerId,
						stationId: el.getId(),
						userName: userName
					})
				);
			});
			_.map(this.deselectedStations, el => {
				arrayOfDeselectedItems.push(
					new CustomerStationUserMappingModel({
						customerId: el.customerId,
						stationId: el.getId(),
						userName: userName
					})
				);
			});
			this._StationDataService.associateStationUserMulti(arrayOfSelectedItems).then(() => {
				this._StationDataService.diassociateStationUserMulti(arrayOfDeselectedItems);
			});
		}
	}

	selectTruckCompany(item: TruckCompanyModel) {
		this.truckCompanies.splice(this.truckCompanies.indexOf(item), 1);
		this.stations.splice(this.deselectedTruckCompanies.indexOf(item), 1);
		this.selectedTruckCompanies.push(item);
	}

	unselectTruckCompany(item: TruckCompanyModel) {
		this.selectedTruckCompanies.splice(this.selectedTruckCompanies.indexOf(item), 1);
		this.deselectedTruckCompanies.push(item);
		this.truckCompanies.push(item);
	}

	selectStation(item: StationModel) {
		this.stations.splice(this.stations.indexOf(item), 1);
		this.stations.splice(this.deselectedStations.indexOf(item), 1);
		this.selectedStations.push(item);
	}

	unselectStation(item: StationModel) {
		this.selectedStations.splice(this.selectedStations.indexOf(item), 1);
		this.deselectedStations.push(item);
		this.stations.push(item);
	}
}

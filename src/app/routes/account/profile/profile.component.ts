import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '@app/user-management/shared/services';
import {DEFAULT_ROLES, UserModel} from '@app/user-management/shared/models/data.models/user.model';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordDialogComponent} from '../change-password-dialog/change-password-dialog.component';
import {UpdateUserProfileDialogComponent} from '../update-user-profile-dialog/update-user-profile-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';
import {UploadAvatarComponent} from '@app/routes/account/profile/upload-avatar/upload-avatar.component';
import {DomSanitizer} from '@angular/platform-browser';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {CmStationDetailsDialogComponent} from '@management/customer-management/cm-station/cm-station-details-dialog/cm-station-details-dialog.component';
import {CustomRouterService} from '@shared/services/others/custom-router.service';
import {CUSTOM_ROUTE_NAMES} from '@shared/constants/routes.constant';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends DefaultComponent implements OnInit {
    user: UserModel;
    stations: StationModel[];
    imgSrc: string;

    constructor(
        private _AuthenticationService: AuthenticationService,
        private _DialogService: DialogService,
        private _StationDataService: StationDataService,
        private _CustomRouterService: CustomRouterService,
        public _DomSanitizationService: DomSanitizer,
    ) {
        super();
    }

    ngOnInit() {
        this._CustomRouterService.setCustomItem(CUSTOM_ROUTE_NAMES.PROFILE);
        this._AuthenticationService.loginedUserObservable.subscribe(user => {
            this.user = user;
            switch (this._AuthenticationService.getRole()) {
                case DEFAULT_ROLES.CUSTOMER:
                    this.addSubscribes(
                        this._StationDataService.stationAllByUsernameObservable
                            .subscribe((el) => {
                                this.stations = el;
                            })
                    );
                    break;
                default:
            }
        });

        this._AuthenticationService.dpUserObservable.subscribe((image: string) => {
            if (!!image) {
                this.imgSrc = `data:image/png;base64,${image}`;
            }
        });

    }

    openChangePassword() {
        this._DialogService.open(ChangePasswordDialogComponent);
    }

    openUpdateUserDetail() {
        this._DialogService.open(UpdateUserProfileDialogComponent, {
            user: this.user
        });
    }

    changeAvatar() {
        this._DialogService.open(UploadAvatarComponent, {
            user: this.user._data
        });
    }

    onDetails(station: StationModel) {
        this._DialogService.open(CmStationDetailsDialogComponent, {
            id: station.getId(),
            readonly: false
        });
    }
}

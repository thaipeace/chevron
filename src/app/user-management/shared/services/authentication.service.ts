import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { UserModel } from '../models/data.models/user.model';
import { Payload } from '../models/payload.model';
import { DEFAULT_ENDPOINTS, DEFAULT_PAYLOADS, USER_MANAGEMENT_DEFAULT_VALUES } from '../constant/constant';
import { LoginAccountModel } from '../models/data.models/login-account.model';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { UtilsService } from './utils.service';
import { TQLFormData } from '@app/shared/models/default/default-object.model';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    payloads = {};
    public user: UserModel;
    public tempUser;

    private loginedUserSource = new BehaviorSubject(null);
    loginedUserObservable = this.loginedUserSource.asObservable();

    private dpUserSource = new BehaviorSubject(null);
    dpUserObservable = this.dpUserSource.asObservable();

    constructor(private apiService: ApiService,
        private userService: UserService,
        private httpClient: HttpClient) {
        this.payloads = {
            get_user_details: new Payload(DEFAULT_PAYLOADS.GET_USER_DETAILS, null, null),
            logout: new Payload('', '', null),
            change_password: new Payload(DEFAULT_PAYLOADS.CHANGE_PASSWORD, null, null)
        };
        if (localStorage.getItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY)) {
            try {
                this.loadOffline();
            } catch (e) {
                this.clearOffline();
            }
        }

    }

    getToken() {
        return this.user ? this.user.token : '';
    }

    getUsername() {
        return this.user ? this.user.username : '';
    }

    getRole() {
        return this.user ? this.user.getValue('roleId') : '';
    }

    getLoginedUser() {
        return this.user;
    }

    fetchDP() {
        this.userService.getDP(this.getUsername())
            .then((value) => {
                this.dpUserSource.next(value['data']['Status']['Image']);
            });
    }

    updateUserInfo(firstName: string, lastName: string, emailId: string) {
        this.user.setRawValue('firstName', firstName);
        this.user.setRawValue('lastName', lastName);
        this.user.setRawValue('emailId', emailId);

        this.saveOffline();
        this.loadOffline();
    }

    logout(): Promise<any> {
        const token = this.getToken();
        if (token) {
            return this.apiService.find(this.payloads['logout'], null,
                {
                    userToken: token,
                    appName: USER_MANAGEMENT_DEFAULT_VALUES.APP_NAME
                }, DEFAULT_ENDPOINTS.LOGOUT)
                .then(() => {
                    this.user = null;
                    this.clearOffline();
                    this.loginedUserSource.next(this.user);
                });
        }
        return of().toPromise();
    }

    login(username: string, password: string) {
        if (username && password) {
            const loginAccount = new LoginAccountModel(username, password);
            return from(this.executeLogin(loginAccount)
                .then((rs) => {
                    if (rs['Auth']['Status'] === 'Success' && rs['Auth']['Token']) {
                        // tslint:disable-next-line:radix
                        return this.loadUserDetails(username, rs['Auth']['Token'], parseInt(rs['Auth']['Expiry']));
                    } else {
                        return {
                            isSuccess: false,
                            message: rs['Auth']['Message']
                        };
                    }
                }));
        } else {
            return of({
                isSuccess: false,
                message: 'error'
            });
        }
    }

    changePassword(changePasswordData: TQLFormData, token: string) {
        return this.apiService.update(this.payloads['change_password'], changePasswordData, {
            userToken: token,
            appName: USER_MANAGEMENT_DEFAULT_VALUES.APP_NAME
        }, DEFAULT_ENDPOINTS.DEFAULT);
    }

    getUserDetails(username, token) {
        return this.apiService.findRaw(this.payloads['get_user_details'],
            [username],
            {
                userToken: token,
                appName: USER_MANAGEMENT_DEFAULT_VALUES.APP_NAME
            }, DEFAULT_ENDPOINTS.DEFAULT);
    }

    private loadUserDetails(username: string, token: string, expiry: number) {
        return this.getUserDetails(username, token)
            .then((rs: any = {}) => {
                if (!rs) {
                    return {
                        isSuccess: false,
                        message: 'no user found'
                    };
                }

                if (rs['data']['Status'] === 'Error') {
                    return {
                        isSuccess: false,
                        message: rs['data']['Message']
                    };
                }

                if (rs['data']['Find']['Result']['User']) {
                    const object = rs['data']['Find']['Result']['User'];
                    object['token'] = token;
                    object['expiry'] = expiry;
                    if (rs['data']['Find']['Result']['Role']) {
                        object['roleName'] = rs['data']['Find']['Result']['Role']['roleName'];
                    }
                    if (object['status'] === 'Reset') {
                        return {
                            isSuccess: false,
                            ...rs,
                            token
                        };
                    }
                    const user = new UserModel(object);
                    // user.route = getRoleByRoleId(object.roleId);
                    if (user.isExpired()) {
                        return {
                            isSuccess: false,
                            message: 'your login session is expired'
                        };
                    }
                    this.user = user;
                    this.saveOffline();
                    this.loadOffline();
                }
                return { isSuccess: true, ...rs, token };
            });
    }

    private executeLogin(loginAccount: LoginAccountModel) {
        return this.httpClient
            .post(
                DEFAULT_ENDPOINTS.LOGIN, null,
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'text/xml',
                        'Authorization': loginAccount.toAuthorizationString()
                    }),
                    responseType: 'text'
                }
            )
            .pipe(
                tap(ErrorHandlerService.logResult, ErrorHandlerService.logError),
                catchError(ErrorHandlerService.handleError), // then handle the error
                map((rs) => {
                    let data = rs;
                    UtilsService.parseXml(data, (rs1) => {
                        data = rs1;
                    });
                    return data;
                })
            ).toPromise();
    }

    private saveOffline() {
        if (this.user) {
            localStorage.setItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY, this.user.toEncryptString());
        }
    }

    private loadOffline() {
        if (localStorage.getItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY)) {
            this.user = new UserModel();
            this.user.decryptToObject(localStorage.getItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY));
        }
        this.fetchDP();
        this.loginedUserSource.next(this.user);
    }

    clearOffline() {
        localStorage.clear();
        this.user = null;
        this.dpUserSource.next(null);
    }

    static loadToken() {
        let token = '';
        if (localStorage.getItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY)) {
            const user = new UserModel();
            user.decryptToObject(localStorage.getItem(USER_MANAGEMENT_DEFAULT_VALUES.STORAGE_KEY));
            token = user.token;
        }
        return token;
    }
}

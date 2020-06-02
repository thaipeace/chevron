import {Injectable} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {$WebSocket} from 'angular2-websocket';
import {NotificationDataService} from './data/notification-data.service';
import {DEFAULT_WS_TRIGGER_POINT} from '@shared/constants/config.constant';
import {AuthenticationService} from '@app/user-management/shared/services';
import {StationDataService} from '@shared/services/data/station-data.service';
import {StationModel} from '@shared/models/data.models/station/station.model';
import * as _ from 'lodash';

// const payloadListMeterReading = PayloadsConstant.METER_READING;

@Injectable({
    providedIn: 'root'
})
export class WsService {
    payloads = {};
    private wsList = {};

    ws: $WebSocket;
    sub: Subscription;

    private newMeterReadingSource = new BehaviorSubject(null);
    newMeterReadingObservable = this.newMeterReadingSource.asObservable();

    private newDeviceAlertSource = new BehaviorSubject(null);
    newDeviceAlertObservable = this.newDeviceAlertSource.asObservable();

    private newDeviceLastSeenSource = new BehaviorSubject(null);
    newDeviceLastSeenObservable = this.newDeviceLastSeenSource.asObservable();

    private isSAPProcessing = new BehaviorSubject(false);
    isSAPProcessingObservable = this.isSAPProcessing.asObservable();

    constructor(private _NotificationDataService: NotificationDataService,
                private _AuthenticationService: AuthenticationService,
                private _StationDataService: StationDataService) {
    }

    public setSAPProcessingStatus(status: boolean) {
        this.isSAPProcessing.next(status);
    }

    public startNotificationWS() {
        if (this.wsList['startNotificationWS']) {
            this.wsList['startNotificationWS'].close(true);
        }

        this.ws = new $WebSocket(
            DEFAULT_WS_TRIGGER_POINT.DEFAULT
        );

        this.wsList['startNotificationWS'] = this.ws;

        this.ws
            .send(
                `{
          "Query": {
          "Storage": "TqlSubscription",
          "Save": {
          "TqlSubscription": {
          "Label": "ChevronNotificationSubscripiton",
          "sid": "22",
          "Notify.As": ":$event:Model:Attribute",
          "Notify.Format": "all",
          "Topic": "*.Notification.*",
          "MessageType":"json:compact"
          }
          }
          }
          }`
            )
            .subscribe();

        // set received message stream
        this.ws.getDataStream().subscribe(
            msg => {
                this.isSAPProcessingObservable.subscribe((rs) => {
                    console.log(rs);
                    if (!rs) {
                        if (this._AuthenticationService.getLoginedUser()
                            && this._AuthenticationService.getLoginedUser().isAdmin()) {
                            // this._NotificationDataService.findAll(5);
                        } else {
                            this._StationDataService.stationAllByUsernameObservable
                                .subscribe((rs) => {
                                    const ids = _.map(rs, (el: StationModel) => {
                                        return el.getId();
                                    });
                                    // this._NotificationDataService.findByStations(ids, 5);
                                });
                        }
                    }
                });
            },
            msg => {
                console.log('error', msg);
            },
            () => {
                console.log('complete');
            }
        );
    }

    destroyWebSocket(): void {
        if (this.sub) {
            try {
                this.sub.unsubscribe();
            } catch (err) {
            }
        }
        if (this.ws) {
            try {
                this.ws.close(true);
            } catch (err) {
            }
        }
    }
}

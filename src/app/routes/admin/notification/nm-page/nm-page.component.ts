import {Component, OnInit} from '@angular/core';
import {NotificationDataService} from '@shared/services/data/notification-data.service';

@Component({
    selector: 'app-nm-page',
    templateUrl: './nm-page.component.html',
    styleUrls: ['./nm-page.component.scss']
})
export class NmPageComponent implements OnInit {

    constructor(
        private _notificationDataService: NotificationDataService) {
    }

    ngOnInit() {

    }
}

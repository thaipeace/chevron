import {Component, Input, OnInit} from '@angular/core';
import {TruckEventModel} from '@shared/models/data.models/fleet/truck-event.model';

@Component({
    selector: '[app-fm-truck-event-details]',
    templateUrl: './fm-truck-event-details.component.html',
    styleUrls: ['./fm-truck-event-details.component.scss']
})
export class FmTruckEventDetailsComponent implements OnInit {
    @Input() event: TruckEventModel;

    constructor() {
    }

    ngOnInit() {
    }

}

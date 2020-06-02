import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DefaultMapClass} from '@shared/models/default/default-component.model';

declare const google: any;

@Component({
    selector: 'app-map-default',
    templateUrl: './map-default.component.html',
    styleUrls: ['./map-default.component.scss']
})
export class MapDefaultComponent extends DefaultMapClass implements OnInit {
    @Output() onMapReady: EventEmitter<any> = new EventEmitter();
    map;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ready(map) {
        this.onMapReady.emit(map);
        this.map = map;
    }
}

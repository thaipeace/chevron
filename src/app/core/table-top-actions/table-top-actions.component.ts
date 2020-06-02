import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-table-top-actions',
    templateUrl: './table-top-actions.component.html',
    styleUrls: ['./table-top-actions.component.scss']
})
export class TableTopActionsComponent implements OnInit {
    @Input() actionButtons: any[];

    constructor() {
    }

    ngOnInit() {
    }

}

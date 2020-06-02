import {
    Component, OnInit, Output, EventEmitter, Input, SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-associated-list',
    templateUrl: './associated-list.component.html',
    styleUrls: ['./associated-list.component.scss']
})
export class AssociatedList implements OnInit {
    @Output() selectItem: EventEmitter<any> = new EventEmitter();
    @Output() removeItem: EventEmitter<any> = new EventEmitter();

    @Input() items: any[] = [];
    @Input() selectedItems: any[] = [];
    @Input() name: string = 'truck Company';
    showItems: any[] = [];

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {items, selectedItems} = changes;
        // if (!!items && !!items.currentValue) {
        //   this.items = items.currentValue;
        // }
        if (!!selectedItems && !!selectedItems.currentValue) {
            this.showItems = [];
            _.map(this.items, (el) => {
                if (!_.find(this.selectedItems, {name: el.name})) {
                    this.showItems.push(el);
                }
            });
        }
    }

    selectNewItem(item: any) {
        this.selectItem.emit(item.item);
    }

    disassociate(item: any) {
        this.removeItem.emit(item);
    }
}

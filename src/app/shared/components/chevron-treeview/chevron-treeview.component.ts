import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    OnChanges, SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material';
import {CmCustomerNewComponent} from '@app/management/customer-management/cm-customer/cm-customer-new/cm-customer-new.component';
import {DialogService} from '@app/shared/services/others/dialog.service';

@Component({
    selector: 'app-chevron-treeview',
    templateUrl: './chevron-treeview.component.html',
    styleUrls: ['./chevron-treeview.component.scss']
})
export class ChevronTreeviewComponent implements OnInit, OnChanges {
    @Input() readonly: boolean = true;
    @Input() searchControl: FormControl;

    @Input() dataSource: MatTreeNestedDataSource<any>;
    @Input() treeControl: NestedTreeControl<any>;
    @Input() addNewMenu: string[] = [];
    @Input() selectedNode: any;
    @Input() hasChild: (_: number, node: any) => boolean;
    @Input() canEdit: (node: any) => boolean = null;
    @Input() canRemove: (node: any) => boolean;
    @Input() treeOf: string;
    @Input() promise: any;

    @Output() add: EventEmitter<string | any> = new EventEmitter<string | any>();
    @Output() edit: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() toggleNode: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectedNodeChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(private _dialog: DialogService) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // let {promise} = changes;
        // console.log(changes);
    }

    onRefresh() {
        this.refresh.emit(true);
    }

    onAddNew(key: string) {
        this.add.emit({
            key,
            disabledSelect: false
        });
    }

    onEdit(node: any) {
        this.edit.emit(node);
    }

    onDelete(node: any) {
        this.delete.emit(node);
    }

    onToggleNode(node) {
        this.toggleNode.emit(node);
    }

    onSelectedNodeChanged(node) {
        this.selectedNodeChanged.emit(node);
    }

    hasEdit(node) {
        return !this.canEdit || this.canEdit(node) === true ? true : null;
    }

    hasRemove(node) {
        return !this.canRemove || this.canRemove(node) === true ? true : null;
    }

    onNewCustomer() {
        const newCustomerDialogRef = this._dialog.open(CmCustomerNewComponent, {
            data: {
                customerDetail: null
            }
        });
    }
}

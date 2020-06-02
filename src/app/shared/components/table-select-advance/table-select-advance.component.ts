import { Component, OnInit, Input, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTable, MatSnackBar } from '@angular/material';
import { X_BUTTON, NOTIFICATION_DEFAULT_DURARION } from '@app/shared/constants/value.constant';

@Component({
  selector: 'app-table-select-advance',
  templateUrl: './table-select-advance.component.html',
  styleUrls: ['./table-select-advance.component.scss']
})
export class TableSelectAdvanceComponent implements OnInit, OnChanges {

  @Input() columnNames: string[];
  @Input() dataArr: any[];
  @Input() showKey: string;
  @Input() compareKey: string;
  @Input() selectedItemValues: string[] = [];
  @Input() isEditing: boolean = true;
  @Output() selectedItemsChange = new EventEmitter();
  
  selectedItems: any[] = [];
  isOpenSelector: boolean = false;
  availableDataArr: any[] = [];
  tableData: MatTableDataSource<any>;
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['index'];

  constructor(
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.onInputChange();
  }

  onInputChange() {
    this.displayedColumns = ['index'];
    this.displayedColumns = this.displayedColumns.concat(this.columnNames);
    if (this.isEditing && !this.displayedColumns.includes('action')) {
      this.displayedColumns.push('action');
    } else if (!this.isEditing && this.displayedColumns.includes('action')) {
      this.displayedColumns.pop();
    }
    
    this.setSelectedItems();
  }

  setSelectedItems() {
    this.selectedItems = this.dataArr.filter(d => this.selectedItemValues.includes(d[this.compareKey]));
    this.availableDataArr = this.dataArr.filter(d => !this.selectedItemValues.includes(d[this.compareKey]));
    this.tableData = new MatTableDataSource(this.selectedItems);
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onDelete(item) {
    this.selectedItemValues = this.selectedItemValues.filter(siv => siv !== item[this.compareKey]);
    this.setSelectedItems();
  }

  onAdd(item) {
    this.selectedItemValues.push(item[this.compareKey])
    this.setSelectedItems();
    this.isOpenSelector = false;
  }

  onDeleteAll() {
    this.selectedItemValues.length = 0;
    this.setSelectedItems();
  }

  openSelection() {
    if (this.availableDataArr.length) {
      this.isOpenSelector = this.isOpenSelector ? false : true;
    } else {
      this._snackBar.open('No summary data found', X_BUTTON, {duration: NOTIFICATION_DEFAULT_DURARION});
    }
    
  }
}
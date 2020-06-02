import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table-select',
  templateUrl: './table-select.component.html',
  styleUrls: ['./table-select.component.scss']
})
export class TableSelectComponent implements OnInit {

  @Input() columnNames: string[];
  @Input() dataArr: any[];
  @Input() compareString: string;
  @Input() selectedItems: string[];
  @Output() selectedItemsChange = new EventEmitter();
 
  tableData: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['select', 'index'];

  selection = new SelectionModel<any>(true, []);

  constructor() { }

  ngOnInit() {
    this.displayedColumns = this.displayedColumns.concat(this.columnNames);

    this.tableData = new MatTableDataSource(this.dataArr);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
    this.setDefaultSelected();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableData.data.forEach(row => this.selection.select(row));
  }

  setDefaultSelected() {
    this.selection.clear();
    this.tableData.data.forEach(row => {
      if (this.selectedItems && this.selectedItems.includes(row[this.compareString])) {
        this.selection.select(row);
      }
    });
  }

  onSelectionsChange(event, row) {
    event ? this.selection.toggle(row) : null;
    this.selectedItems = this.selection.selected.map(s => s[this.compareString]);
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onMasterSelectionsChange(event) {
    event ? this.masterToggle() : null;
    this.selectedItems = this.selection.selected.map(s => s[this.compareString]);
    this.selectedItemsChange.emit(this.selectedItems);
  }
}

import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MatDialog, MatTableDataSource, MatSnackBar, MatPaginator, MatSort} from '@angular/material';
import {DialogService} from '@shared/services/others/dialog.service';
import {debounceTime} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {NotificationModel} from '@app/shared/models/data.models/notification/notification.model';
import {NotificationDataService} from '@app/shared/services/data/notification-data.service';
import {NmDetailsDialogComponent} from '../nm-details-dialog/nm-details-dialog.component';
import {NmDeleteDialogComponent} from '../nm-delete-dialog/nm-delete-dialog.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-nm-list',
  templateUrl: './nm-list.component.html',
  styleUrls: ['./nm-list.component.scss']
})
export class NmListComponent extends DefaultComponent implements OnInit {
  @Input() readonly: boolean = true;
  @Input() otherOptions: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableData: MatTableDataSource<NotificationModel>;
  notification: NotificationModel[] = [];
  displayedColumns = ['index', 'id', 'abbreviatedMessage', 'source', 'type', 'category', 'categoryNumber', 'message', 'priority', 'datetime', 'username', 'actions'];
  searchControl: FormControl = new FormControl('');
  offset: number = 0;
  pageSize: number = 10;
  sortColumn: string = 'readingTime';
  sortType: string = 'desc';
  onLoading: boolean = false;
  countedItem: number = 0;

  constructor(private _notificationDataService: NotificationDataService,
              private route: ActivatedRoute,
              private _dialogService: DialogService) {
    super();
    console.log(this.route.snapshot.paramMap.get('otherOptions'));
    if (this.route.snapshot.paramMap.get('otherOptions')) {
      this.otherOptions = this.route.snapshot.paramMap.get('otherOptions');
    }
  }

  ngOnInit() {
    this.addSubscribes(
      this._notificationDataService.findAllSourceForManagementObservable
        .subscribe((rs) => {
          this.countedItem = rs.length;
          this.notification = rs;
          this.notification = this.notification.map((u, index) => {
            u.index = (index + 1).toString();
            return u;
          });
          console.log(this.notification);
          this.tableData = new MatTableDataSource(this.notification);
          this.onLoading = false;
        })
    );
    this.reload();
  }

  onRefresh() {
    this.paginator.firstPage();
    this.reload();
  }

  reload() {
    this.onLoading = true;
    this.tableData = null;
    const sortColumn = this.sortColumn === 'datetime' ? 'readingTime' : this.sortColumn;
    this._notificationDataService.findAllForManagementOptions(this.pageSize, this.offset * this.pageSize,
      sortColumn, this.sortType, this.otherOptions);
  }

  onDetails(item) {
    this._dialogService.open(NmDetailsDialogComponent,
      {id: item.getId()}, {width: '600px'});
  }

  onPaginateChange(isInCreased: boolean) {
    if (isInCreased) {
      this.offset += 1;
    } else {
      this.offset -= 1;
    }

    this.reload();
  }

  onRemove(item) {
    const dialogRef = this._dialogService.open(NmDeleteDialogComponent, item,
      {
        width: '500px',
      }
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'Deleted') {
        this.notification.splice(this.notification.indexOf(item), 1);
        this.tableData = new MatTableDataSource(this.notification);
      }
    });
  }

  sortChange(e) {
    this.sortColumn = e.active;
    this.sortType = e.direction;
    this.reload();
  }

  getPageStartIndex(): number {
    return this.paginator.pageIndex * this.paginator.pageSize;
  }

}

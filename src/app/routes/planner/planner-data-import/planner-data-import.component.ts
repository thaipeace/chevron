import {Component, OnInit} from '@angular/core';
import {DialogService} from '@shared/services/others/dialog.service';
import {ImHistoryImportDialogComponent} from '@management/inventory-management/im-history-import-dialog/im-history-import-dialog.component';
import {WizardImportDialogComponent} from '@shared/components/dialogs/wizard-import-dialog/wizard-import-dialog.component';

@Component({
  selector: 'app-planner-data-import',
  templateUrl: './planner-data-import.component.html',
  styleUrls: ['./planner-data-import.component.scss']
})
export class PlannerDataImportComponent implements OnInit {

  constructor(
    private _DialogService: DialogService
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      // this.onImportHistoryInventory();
    }, 1000);

  }

  onImportHistoryInventory() {
    this._DialogService.open(ImHistoryImportDialogComponent);
  }

  onImportOrderHistory() {
    this._DialogService.open(WizardImportDialogComponent);
  }
}

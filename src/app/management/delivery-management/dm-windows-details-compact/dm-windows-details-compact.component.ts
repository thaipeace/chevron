import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DefaultComponent} from '@shared/models/default/default-component.model';
import {IDynamicComponent} from '@shared/models/dynamic-item.class';
import {SideBarService} from '@shared/services/side-bar.service';
import {SideBarControl} from '@shared/models/sidebar-control.class';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {DeliveryWindowModel} from '@shared/models/data.models/delivery/delivery-window.model';
import * as moment from 'moment';
import {DeliveryDataService} from '@shared/services/data/delivery-data.service';
import {IQuestionDialogModel} from '@shared/models/dialog/question.dialog.model';
import {MessageQuestionDialogComponent} from '@shared/components/dialogs/message-question-dialog/message-question-dialog.component';
import {DialogService} from '@shared/services/others/dialog.service';

@Component({
  selector: 'app-dm-windows-details-compact',
  templateUrl: './dm-windows-details-compact.component.html',
  styleUrls: ['./dm-windows-details-compact.component.scss']
})
export class DmWindowsDetailsCompactComponent extends DefaultComponent implements OnInit, OnChanges, IDynamicComponent {
  @Input() data: any;
  @ViewChild('f') public form: NgForm;
  formDOM: FormGroup;
  control: SideBarControl = null;

  isEditing = false;
  isCollapse = false;
  id: string;
  containerId: string;
  object: DeliveryWindowModel;

  constructor(private _SideBarService: SideBarService,
              private _DeliveryDataService: DeliveryDataService,
              private _DialogService: DialogService) {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onDataChange();
  }

  onDataChange() {
    if (this.data) {
      if (this.data['control']) {
        this.control = this.data['control'];
      }
      if (this.data['containerId']) {
        this.containerId = this.data['containerId'];
      }
      if (this.data['id']) {
        this.id = this.data['id'];
        this.loadData();
      }
    }
  }

  loadData() {
    if (this.id) {
      this._DeliveryDataService.findDeliveryWindowsById(this.id)
        .then((rs) => {
          this.object = rs;
        });
    }
  }

  massageFormData() {
    this.formDOM = new FormGroup({
      'startDate': new FormControl(moment(parseInt(this.object.getRawValue('StartDate'))).toDate() || '', [Validators.required]),
      'duration': new FormControl(this.object['duration'] || 0, [Validators.required]),
      'startTime': new FormControl(moment(parseInt(this.object.getRawValue('startTime'))).toDate() || '', [Validators.required]),
      'endTime': new FormControl(moment(parseInt(this.object.getRawValue('endTime'))).toDate() || '', [Validators.required]),
      'maxDistribution': new FormControl(this.object.getRawValue('maxMonthlyDeliveryDistribution') || '', [Validators.required]),
      'name': new FormControl(this.object.getRawValue('DeliveryWindowName') || '', [Validators.required]),
    });
  }

  toHourMinute(time: any) {
    try {
      return moment(parseInt(time)).format('HH:mm');
    } catch (e) {
      return time;
    }
    return time;
  }

  close() {
    this._SideBarService.close(this.containerId);
    this.control.fn_close();
    this.unsubscribeAll();
  }

  onEdit() {
    this.massageFormData();
    this.isEditing = true;
  }

  onCancelEdit() {
    this.isEditing = false;
  }

  onUpdate() {
    const startDate = moment(this.formDOM.get('startDate').value.getTime()).startOf('day');
    const endDate = moment(startDate).add(this.formDOM.get('duration').value, 'days').endOf('day');
    const startTime = moment(this.formDOM.get('startTime').value);
    const endTime = moment(this.formDOM.get('endTime').value);

    this._DeliveryDataService.updateDeliveryWindow(
      this.object.getId(),
      this.formDOM.get('name').value,
      startDate.valueOf(),
      endDate.valueOf(),
      startTime.valueOf(),
      endTime.valueOf(),
      this.formDOM.get('maxDistribution').value)
      .then((rs) => {
        if (rs) {
          // refresh data
          this.loadData();
          this._SideBarService.refresh('deliveryWindow');
          this.isEditing = false;
        }
      });
  }

  onDelete() {
    const dialogData: IQuestionDialogModel = {
      title: '',
      question: `Are you sure to delete it?`,
      onYes: () => {
        this._DeliveryDataService.deleteDeliveryWindowById(this.object.getId())
          .then((rs) => {
            if (rs) {
              // close and refresh data
              this.close();
              this._SideBarService.refresh('deliveryWindow');
            }
          });
      }
    };

    this._DialogService.open(MessageQuestionDialogComponent, dialogData);
  }
}

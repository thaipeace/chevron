import { ICustomerModeModel, ICustomerModel, MODE_DATA, CUSTOMER_DATA } from './../models/customer-mode.model';
import { Component, OnInit } from '@angular/core';
import { copyArrayItem, CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-customer-mode',
  templateUrl: './customer-mode.component.html',
  styleUrls: ['./customer-mode.component.scss']
})
export class CustomerModeComponent implements OnInit {
  modes: ICustomerModeModel[];
  customers: ICustomerModel[];
  selectedMode: ICustomerModeModel;
  selectedCustomer: ICustomerModel;
  selectedCustomerMode: ICustomerModel;

  constructor() { }

  ngOnInit() {
    this.modes = [...MODE_DATA];
    this.customers = [...CUSTOMER_DATA];
    this.selectedMode = this.modes[0];
    this.selectedCustomerMode = this.selectedMode.customers[0];
    this.selectedCustomer = this.customers[0];
  }

  addCustomerToMode(mode: ICustomerModeModel, customer: ICustomerModel) {
    if (!!mode && !!customer) {
      mode.customers.push(customer);
    }
  }

  removeCustomerToMode(mode: ICustomerModeModel, customer: ICustomerModel) {
    if (!!mode && !!customer) {
      const currentIndex = mode.customers.indexOf(customer);
      mode.customers.splice(currentIndex, 1);
      if (customer.id === this.selectedCustomerMode.id) {
        const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        this.selectedCustomerMode = mode.customers.length === 0 ? null : mode.customers[newIndex];
      }
    }
  }

  changeMode(mode: ICustomerModeModel) {
    this.selectedMode = mode;
    this.selectedCustomerMode = this.selectedMode.customers[0];
  }

  changeCustomer(customer: ICustomerModel) {
    this.selectedCustomer = customer;
  }

  changeCustomerMode(customer: ICustomerModel) {
    this.selectedCustomerMode = customer;
  }

  dropCustomerToMode(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  canMoveLeft() {
    return !!this.selectedCustomer && !this.selectedMode.customers.find(customer => customer.id === this.selectedCustomer.id);
  }

  canMoveRight() {
    return !!this.selectedCustomerMode;
  }

  dropCustomerToCustomer(event: CdkDragDrop<string[]>, mode: ICustomerModeModel) {
    if (event.previousContainer !== event.container) {
      this.removeCustomerToMode(mode, event.item.data);
    }
  }

  customerModePredicate(drag: CdkDrag<ICustomerModel>, dropList: CdkDropList<ICustomerModeModel[]>) {
    return !dropList.data.find(c => c.id === drag.data.id);
  }

  isCustomerExisted(customer: ICustomerModel, customerList: ICustomerModel[]) {
    return !!customerList.find(c => c.id === customer.id);
  }

}

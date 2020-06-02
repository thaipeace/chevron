/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmCustomerNewComponent } from './cm-customer-new.component';

describe('CmCustomerNewComponent', () => {
  let component: CmCustomerNewComponent;
  let fixture: ComponentFixture<CmCustomerNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCustomerNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCustomerNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

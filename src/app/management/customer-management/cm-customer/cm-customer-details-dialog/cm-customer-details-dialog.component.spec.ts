import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCustomerDetailsDialogComponent } from './cm-customer-details-dialog.component';

describe('CmCustomerDetailsDialogComponent', () => {
  let component: CmCustomerDetailsDialogComponent;
  let fixture: ComponentFixture<CmCustomerDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCustomerDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCustomerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCustomerDetailsDialogComponent } from './role-customer-details-dialog.component';

describe('RoleCustomerDetailsDialogComponent', () => {
  let component: RoleCustomerDetailsDialogComponent;
  let fixture: ComponentFixture<RoleCustomerDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleCustomerDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleCustomerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

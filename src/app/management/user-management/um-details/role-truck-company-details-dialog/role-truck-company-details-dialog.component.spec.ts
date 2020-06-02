import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleTruckCompanyDetailsDialogComponent } from './role-truck-company-details-dialog.component';

describe('RoleTruckCompanyDetailsDialogComponent', () => {
  let component: RoleTruckCompanyDetailsDialogComponent;
  let fixture: ComponentFixture<RoleTruckCompanyDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTruckCompanyDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleTruckCompanyDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

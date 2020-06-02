import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCustomerNewDialogComponent } from './cm-customer-new-dialog.component';

describe('CmCustomerNewDialogComponent', () => {
  let component: CmCustomerNewDialogComponent;
  let fixture: ComponentFixture<CmCustomerNewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCustomerNewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCustomerNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

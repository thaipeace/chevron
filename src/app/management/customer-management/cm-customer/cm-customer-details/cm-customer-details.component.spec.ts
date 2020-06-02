import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCustomerDetailsComponent } from './cm-customer-details.component';

describe('CmCustomerDetailsComponent', () => {
  let component: CmCustomerDetailsComponent;
  let fixture: ComponentFixture<CmCustomerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCustomerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

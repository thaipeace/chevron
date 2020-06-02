import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTreeviewComponent } from './customer-treeview.component';

describe('CustomerTreeviewComponent', () => {
  let component: CustomerTreeviewComponent;
  let fixture: ComponentFixture<CustomerTreeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTreeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

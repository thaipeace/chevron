import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerModeComponent } from './customer-mode.component';

describe('CustomerModeComponent', () => {
  let component: CustomerModeComponent;
  let fixture: ComponentFixture<CustomerModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

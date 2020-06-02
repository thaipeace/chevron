import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmCustomerPageComponent } from './cm-customer-page.component';

describe('CmCustomerPageComponent', () => {
  let component: CmCustomerPageComponent;
  let fixture: ComponentFixture<CmCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

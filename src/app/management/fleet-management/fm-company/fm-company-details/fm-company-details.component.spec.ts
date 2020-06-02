import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmCompanyDetailsComponent } from './fm-company-details.component';

describe('FmCompanyDetailsComponent', () => {
  let component: FmCompanyDetailsComponent;
  let fixture: ComponentFixture<FmCompanyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmCompanyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

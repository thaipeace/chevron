import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationServicesStatusComponent } from './integration-services-status.component';

describe('IntegrationServicesStatusComponent', () => {
  let component: IntegrationServicesStatusComponent;
  let fixture: ComponentFixture<IntegrationServicesStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationServicesStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationServicesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

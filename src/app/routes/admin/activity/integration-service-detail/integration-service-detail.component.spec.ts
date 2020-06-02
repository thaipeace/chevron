import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationServiceDetailComponent } from './integration-service-detail.component';

describe('IntegrationServiceDetailComponent', () => {
  let component: IntegrationServiceDetailComponent;
  let fixture: ComponentFixture<IntegrationServiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationServiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

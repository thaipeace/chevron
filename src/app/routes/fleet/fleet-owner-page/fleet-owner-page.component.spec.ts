import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOwnerPageComponent } from './fleet-owner-page.component';

describe('FleetOwnerPageComponent', () => {
  let component: FleetOwnerPageComponent;
  let fixture: ComponentFixture<FleetOwnerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetOwnerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOwnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetBaseComponent } from './fleet-base.component';

describe('FleetBaseComponent', () => {
  let component: FleetBaseComponent;
  let fixture: ComponentFixture<FleetBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

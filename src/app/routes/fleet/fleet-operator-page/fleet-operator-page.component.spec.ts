import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOperatorPageComponent } from './fleet-operator-page.component';

describe('FleetOperatorPageComponent', () => {
  let component: FleetOperatorPageComponent;
  let fixture: ComponentFixture<FleetOperatorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetOperatorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOperatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOrderTrackingComponent } from './map-order-tracking.component';

describe('MapOrderTrackingComponent', () => {
  let component: MapOrderTrackingComponent;
  let fixture: ComponentFixture<MapOrderTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapOrderTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOrderTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

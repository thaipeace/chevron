import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTruckHistoricalLocationComponent } from './map-truck-historical-location.component';

describe('MapTruckHistoricalLocationComponent', () => {
  let component: MapTruckHistoricalLocationComponent;
  let fixture: ComponentFixture<MapTruckHistoricalLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTruckHistoricalLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTruckHistoricalLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

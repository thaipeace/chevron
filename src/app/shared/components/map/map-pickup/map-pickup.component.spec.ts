import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPickupComponent } from './map-pickup.component';

describe('MapPickupComponent', () => {
  let component: MapPickupComponent;
  let fixture: ComponentFixture<MapPickupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPickupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPickupDialogComponent } from './map-pickup-dialog.component';

describe('MapPickupDialogComponent', () => {
  let component: MapPickupDialogComponent;
  let fixture: ComponentFixture<MapPickupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPickupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPickupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

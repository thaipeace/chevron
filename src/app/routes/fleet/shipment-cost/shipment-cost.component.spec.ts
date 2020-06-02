import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentCostComponent } from './shipment-cost.component';

describe('ShipmentCostComponent', () => {
  let component: ShipmentCostComponent;
  let fixture: ComponentFixture<ShipmentCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

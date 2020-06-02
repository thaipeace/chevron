import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationInventoryDetailsComponent } from './station-inventory-details.component';

describe('CmStationInventoryDetailsComponent', () => {
  let component: StationInventoryDetailsComponent;
  let fixture: ComponentFixture<StationInventoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationInventoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

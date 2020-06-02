import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckHistoricalLocationComponent } from './fm-truck-historical-location.component';

describe('FmTruckHistoricalLocationComponent', () => {
  let component: FmTruckHistoricalLocationComponent;
  let fixture: ComponentFixture<FmTruckHistoricalLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckHistoricalLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckHistoricalLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

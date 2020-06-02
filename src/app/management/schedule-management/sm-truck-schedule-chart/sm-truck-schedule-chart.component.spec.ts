import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTruckScheduleChartComponent } from './sm-truck-schedule-chart.component';

describe('SmTruckScheduleChartComponent', () => {
  let component: SmTruckScheduleChartComponent;
  let fixture: ComponentFixture<SmTruckScheduleChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTruckScheduleChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTruckScheduleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

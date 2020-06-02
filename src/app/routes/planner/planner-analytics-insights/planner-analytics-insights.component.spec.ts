import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerAnalyticsInsightsComponent } from './planner-analytics-insights.component';

describe('PlannerAnalyticsInsightsComponent', () => {
  let component: PlannerAnalyticsInsightsComponent;
  let fixture: ComponentFixture<PlannerAnalyticsInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerAnalyticsInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerAnalyticsInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

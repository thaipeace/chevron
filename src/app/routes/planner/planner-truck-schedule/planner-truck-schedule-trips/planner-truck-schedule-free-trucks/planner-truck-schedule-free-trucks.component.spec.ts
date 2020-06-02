import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerTruckScheduleFreeTrucksComponent } from './planner-truck-schedule-free-trucks.component';

describe('PlannerTruckScheduleFreeTrucksComponent', () => {
  let component: PlannerTruckScheduleFreeTrucksComponent;
  let fixture: ComponentFixture<PlannerTruckScheduleFreeTrucksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerTruckScheduleFreeTrucksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerTruckScheduleFreeTrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

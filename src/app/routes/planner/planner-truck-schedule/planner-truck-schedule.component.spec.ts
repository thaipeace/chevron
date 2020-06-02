import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerTruckScheduleComponent } from './planner-truck-schedule.component';

describe('PlannerTruckScheduleComponent', () => {
  let component: PlannerTruckScheduleComponent;
  let fixture: ComponentFixture<PlannerTruckScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerTruckScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerTruckScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

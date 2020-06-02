import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerTruckScheduleTripsComponent } from './planner-truck-schedule-trips.component';

describe('PlannerTruckScheduleTripsComponent', () => {
  let component: PlannerTruckScheduleTripsComponent;
  let fixture: ComponentFixture<PlannerTruckScheduleTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerTruckScheduleTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerTruckScheduleTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

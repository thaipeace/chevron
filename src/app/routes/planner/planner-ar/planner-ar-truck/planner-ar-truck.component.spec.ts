import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerArTruckComponent } from './planner-ar-truck.component';

describe('PlannerArTruckComponent', () => {
  let component: PlannerArTruckComponent;
  let fixture: ComponentFixture<PlannerArTruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerArTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerArTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

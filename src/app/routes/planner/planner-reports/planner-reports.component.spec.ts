import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerReportsComponent } from './planner-reports.component';

describe('PlannerReportsComponent', () => {
  let component: PlannerReportsComponent;
  let fixture: ComponentFixture<PlannerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

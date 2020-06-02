import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerDeliveryComponent } from './planner-delivery.component';

describe('PlannerDeliveryComponent', () => {
  let component: PlannerDeliveryComponent;
  let fixture: ComponentFixture<PlannerDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

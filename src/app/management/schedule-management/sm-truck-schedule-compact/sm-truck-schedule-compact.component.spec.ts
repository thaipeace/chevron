import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTruckScheduleCompactComponent } from './sm-truck-schedule-compact.component';

describe('SmTruckScheduleCompactComponent', () => {
  let component: SmTruckScheduleCompactComponent;
  let fixture: ComponentFixture<SmTruckScheduleCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTruckScheduleCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTruckScheduleCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

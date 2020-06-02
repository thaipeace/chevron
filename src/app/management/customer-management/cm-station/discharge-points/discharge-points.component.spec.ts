import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DischargePointsComponent } from './discharge-points.component';

describe('DischargePointsComponent', () => {
  let component: DischargePointsComponent;
  let fixture: ComponentFixture<DischargePointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DischargePointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DischargePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

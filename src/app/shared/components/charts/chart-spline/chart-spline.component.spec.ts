import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSplineComponent } from './chart-spline.component';

describe('ChartSplineComponent', () => {
  let component: ChartSplineComponent;
  let fixture: ComponentFixture<ChartSplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

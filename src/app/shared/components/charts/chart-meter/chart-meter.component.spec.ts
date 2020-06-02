import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMeterComponent } from './chart-meter.component';

describe('ChartMeterComponent', () => {
  let component: ChartMeterComponent;
  let fixture: ComponentFixture<ChartMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

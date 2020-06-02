import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnLineDailyComponent } from './chart-column-line-daily.component';

describe('ChartColumnLineDailyComponent', () => {
  let component: ChartColumnLineDailyComponent;
  let fixture: ComponentFixture<ChartColumnLineDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartColumnLineDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartColumnLineDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

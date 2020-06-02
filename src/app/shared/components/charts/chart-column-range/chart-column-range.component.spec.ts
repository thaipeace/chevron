import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnRangeComponent } from './chart-column-range.component';

describe('ChartColumnRangeComponent', () => {
  let component: ChartColumnRangeComponent;
  let fixture: ComponentFixture<ChartColumnRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartColumnRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartColumnRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

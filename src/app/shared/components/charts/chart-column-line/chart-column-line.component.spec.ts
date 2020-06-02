import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnLineComponent } from './chart-column-line.component';

describe('ChartColumnLineComponent', () => {
  let component: ChartColumnLineComponent;
  let fixture: ComponentFixture<ChartColumnLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartColumnLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartColumnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

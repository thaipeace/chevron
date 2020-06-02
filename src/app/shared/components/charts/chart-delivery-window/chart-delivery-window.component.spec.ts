import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDeliveryWindowComponent } from './chart-delivery-window.component';

describe('ChartDeliveryWindowComponent', () => {
  let component: ChartDeliveryWindowComponent;
  let fixture: ComponentFixture<ChartDeliveryWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDeliveryWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDeliveryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

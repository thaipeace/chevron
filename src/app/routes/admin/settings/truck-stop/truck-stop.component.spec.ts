import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckStopComponent } from './truck-stop.component';

describe('TruckStopComponent', () => {
  let component: TruckStopComponent;
  let fixture: ComponentFixture<TruckStopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

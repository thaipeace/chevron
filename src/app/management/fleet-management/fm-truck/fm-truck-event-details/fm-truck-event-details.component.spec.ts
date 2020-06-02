import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckEventDetailsComponent } from './fm-truck-event-details.component';

describe('FmTruckEventDetailsComponent', () => {
  let component: FmTruckEventDetailsComponent;
  let fixture: ComponentFixture<FmTruckEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

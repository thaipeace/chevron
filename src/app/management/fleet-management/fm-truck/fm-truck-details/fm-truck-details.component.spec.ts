import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckDetailsComponent } from './fm-truck-details.component';

describe('FmTruckDetailsComponent', () => {
  let component: FmTruckDetailsComponent;
  let fixture: ComponentFixture<FmTruckDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

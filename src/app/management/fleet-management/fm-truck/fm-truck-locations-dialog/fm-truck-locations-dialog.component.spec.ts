import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckLocationsDialogComponent } from './fm-truck-locations-dialog.component';

describe('FmTruckLocationsDialogComponent', () => {
  let component: FmTruckLocationsDialogComponent;
  let fixture: ComponentFixture<FmTruckLocationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckLocationsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckLocationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

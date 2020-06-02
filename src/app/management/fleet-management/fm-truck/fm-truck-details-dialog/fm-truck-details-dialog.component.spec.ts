import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckDetailsDialogComponent } from './fm-truck-details-dialog.component';

describe('FmTruckDetailsDialogComponent', () => {
  let component: FmTruckDetailsDialogComponent;
  let fixture: ComponentFixture<FmTruckDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

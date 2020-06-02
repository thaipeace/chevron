import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckEventDetailsDialogComponent } from './fm-truck-event-details-dialog.component';

describe('FmTruckEventDetailsDialogComponent', () => {
  let component: FmTruckEventDetailsDialogComponent;
  let fixture: ComponentFixture<FmTruckEventDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckEventDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckEventDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckEditableDialogComponent } from './fm-truck-editable-dialog.component';

describe('FmTruckEditableDialogComponent', () => {
  let component: FmTruckEditableDialogComponent;
  let fixture: ComponentFixture<FmTruckEditableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckEditableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckEditableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

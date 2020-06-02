import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmTruckDeleteDialogComponent } from './fm-truck-delete-dialog.component';

describe('FmTruckDeleteDialogComponent', () => {
  let component: FmTruckDeleteDialogComponent;
  let fixture: ComponentFixture<FmTruckDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmTruckDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmTruckDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

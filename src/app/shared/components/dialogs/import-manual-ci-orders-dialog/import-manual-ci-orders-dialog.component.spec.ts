import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportManualCiOrdersDialogComponent } from './import-manual-ci-orders-dialog.component';

describe('ImportManualCiOrdersDialogComponent', () => {
  let component: ImportManualCiOrdersDialogComponent;
  let fixture: ComponentFixture<ImportManualCiOrdersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportManualCiOrdersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportManualCiOrdersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

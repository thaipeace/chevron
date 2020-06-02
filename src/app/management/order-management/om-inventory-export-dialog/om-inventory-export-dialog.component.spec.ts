import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmInventoryExportDialogComponent } from './om-inventory-export-dialog.component';

describe('OmInventoryExportDialogComponent', () => {
  let component: OmInventoryExportDialogComponent;
  let fixture: ComponentFixture<OmInventoryExportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmInventoryExportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmInventoryExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

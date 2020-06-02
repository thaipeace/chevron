import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOrderExportDialogComponent } from './om-order-export-dialog.component';

describe('OmOrderExportDialogComponent', () => {
  let component: OmOrderExportDialogComponent;
  let fixture: ComponentFixture<OmOrderExportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmOrderExportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmOrderExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QmImportDialogComponent } from './qm-import-dialog.component';

describe('QmImportDialogComponent', () => {
  let component: QmImportDialogComponent;
  let fixture: ComponentFixture<QmImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QmImportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QmImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

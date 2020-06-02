import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSapFileDialogComponent } from './upload-sap-file-dialog.component';

describe('UploadSapFileDialogComponent', () => {
  let component: UploadSapFileDialogComponent;
  let fixture: ComponentFixture<UploadSapFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSapFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSapFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

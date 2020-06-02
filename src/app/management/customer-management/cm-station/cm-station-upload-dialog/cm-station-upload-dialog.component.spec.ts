import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmStationUploadDialogComponent } from './cm-station-upload-dialog.component';

describe('CmStationUploadDialogComponent', () => {
  let component: CmStationUploadDialogComponent;
  let fixture: ComponentFixture<CmStationUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationUploadDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmStationDetailsDialogComponent } from './cm-station-details-dialog.component';

describe('CmStationDetailsDialogComponent', () => {
  let component: CmStationDetailsDialogComponent;
  let fixture: ComponentFixture<CmStationDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmStationDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmStationDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmTankDetailsDialogComponent } from './cm-tank-details-dialog.component';

describe('CmTankDetailsDialogComponent', () => {
  let component: CmTankDetailsDialogComponent;
  let fixture: ComponentFixture<CmTankDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmTankDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmTankDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

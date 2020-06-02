import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverDetailsDialogComponent } from './fm-driver-details-dialog.component';

describe('FmDriverDetailsDialogComponent', () => {
  let component: FmDriverDetailsDialogComponent;
  let fixture: ComponentFixture<FmDriverDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

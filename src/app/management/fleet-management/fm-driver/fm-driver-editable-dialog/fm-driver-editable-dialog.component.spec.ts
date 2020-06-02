import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmDriverEditableDialogComponent } from './fm-driver-editable-dialog.component';

describe('FmDriverEditableDialogComponent', () => {
  let component: FmDriverEditableDialogComponent;
  let fixture: ComponentFixture<FmDriverEditableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmDriverEditableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmDriverEditableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

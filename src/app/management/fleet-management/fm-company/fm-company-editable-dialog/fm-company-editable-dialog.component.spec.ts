import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmCompanyEditableDialogComponent } from './fm-company-editable-dialog.component';

describe('FmCompanyEditableDialogComponent', () => {
  let component: FmCompanyEditableDialogComponent;
  let fixture: ComponentFixture<FmCompanyEditableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmCompanyEditableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmCompanyEditableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

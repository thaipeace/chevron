import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FmCompanyDeleteDialogComponent } from './fm-company-delete-dialog.component';

describe('FmCompanyDeleteDialogComponent', () => {
  let component: FmCompanyDeleteDialogComponent;
  let fixture: ComponentFixture<FmCompanyDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FmCompanyDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FmCompanyDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

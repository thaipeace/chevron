import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardImportDialogComponent } from './wizard-import-dialog.component';

describe('WizardImportDialogComponent', () => {
  let component: WizardImportDialogComponent;
  let fixture: ComponentFixture<WizardImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardImportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

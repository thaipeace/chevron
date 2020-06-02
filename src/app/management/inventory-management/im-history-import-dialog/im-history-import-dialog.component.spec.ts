import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImHistoryImportDialogComponent } from './im-history-import-dialog.component';

describe('ImHistoryImportDialogComponent', () => {
  let component: ImHistoryImportDialogComponent;
  let fixture: ComponentFixture<ImHistoryImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImHistoryImportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImHistoryImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

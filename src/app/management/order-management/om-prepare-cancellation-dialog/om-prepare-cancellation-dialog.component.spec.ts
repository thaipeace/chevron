import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmPrepareCancellationDialogComponent } from './om-prepare-cancellation-dialog.component';

describe('OmPrepareCancellationDialogComponent', () => {
  let component: OmPrepareCancellationDialogComponent;
  let fixture: ComponentFixture<OmPrepareCancellationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmPrepareCancellationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmPrepareCancellationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

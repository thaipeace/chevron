import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpmEditableCoordinateDialogComponent } from './mpm-editable-coordinate-dialog.component';

describe('MpmEditableCoordinateDialogComponent', () => {
  let component: MpmEditableCoordinateDialogComponent;
  let fixture: ComponentFixture<MpmEditableCoordinateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpmEditableCoordinateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpmEditableCoordinateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

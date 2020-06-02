import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpmMapSelectionDialogComponent } from './mpm-map-selection-dialog.component';

describe('MpmMapSelectionDialogComponent', () => {
  let component: MpmMapSelectionDialogComponent;
  let fixture: ComponentFixture<MpmMapSelectionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpmMapSelectionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpmMapSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

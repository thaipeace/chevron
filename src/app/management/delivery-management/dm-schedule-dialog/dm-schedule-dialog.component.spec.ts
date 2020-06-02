import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmScheduleDialogComponent } from './dm-schedule-dialog.component';

describe('DmScheduleDialogComponent', () => {
  let component: DmScheduleDialogComponent;
  let fixture: ComponentFixture<DmScheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmScheduleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

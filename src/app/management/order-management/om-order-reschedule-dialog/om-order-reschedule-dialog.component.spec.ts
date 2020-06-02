import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOrderRescheduleDialogComponent } from './om-order-reschedule-dialog.component';

describe('OmOrderRescheduleDialogComponent', () => {
  let component: OmOrderRescheduleDialogComponent;
  let fixture: ComponentFixture<OmOrderRescheduleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmOrderRescheduleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmOrderRescheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

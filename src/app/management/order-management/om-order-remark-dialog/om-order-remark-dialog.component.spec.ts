import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOrderRemarkDialogComponent } from './om-order-remark-dialog.component';

describe('OmOrderRemarkDialogComponent', () => {
  let component: OmOrderRemarkDialogComponent;
  let fixture: ComponentFixture<OmOrderRemarkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmOrderRemarkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmOrderRemarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

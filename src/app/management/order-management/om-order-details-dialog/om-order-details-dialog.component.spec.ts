import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmOrderDetailsDialogComponent } from './om-order-details-dialog.component';

describe('OmOrderDetailsDialogComponent', () => {
  let component: OmOrderDetailsDialogComponent;
  let fixture: ComponentFixture<OmOrderDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmOrderDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmOrderDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDischargePointComponent } from './edit-discharge-point.component';

describe('EditDischargePointComponent', () => {
  let component: EditDischargePointComponent;
  let fixture: ComponentFixture<EditDischargePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDischargePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDischargePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

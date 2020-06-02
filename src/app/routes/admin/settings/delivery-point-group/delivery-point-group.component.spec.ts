import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPointGroupComponent } from './delivery-point-group.component';

describe('DeliveryPointGroupComponent', () => {
  let component: DeliveryPointGroupComponent;
  let fixture: ComponentFixture<DeliveryPointGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPointGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPointGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

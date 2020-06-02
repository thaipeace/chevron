import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripReferenceComponent } from './edit-trip-reference.component';

describe('EditTripReferenceComponent', () => {
  let component: EditTripReferenceComponent;
  let fixture: ComponentFixture<EditTripReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTripReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTripReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

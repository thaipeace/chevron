import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBaseProductTypesComponent } from './edit-base-product-types.component';

describe('EditBaseProductTypesComponent', () => {
  let component: EditBaseProductTypesComponent;
  let fixture: ComponentFixture<EditBaseProductTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBaseProductTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBaseProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

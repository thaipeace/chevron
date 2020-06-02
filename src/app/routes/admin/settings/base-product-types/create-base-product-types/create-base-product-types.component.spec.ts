import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBaseProductTypesComponent } from './create-base-product-types.component';

describe('CreateBaseProductTypesComponent', () => {
  let component: CreateBaseProductTypesComponent;
  let fixture: ComponentFixture<CreateBaseProductTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBaseProductTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBaseProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

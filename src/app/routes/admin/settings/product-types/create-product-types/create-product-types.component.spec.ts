import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductTypesComponent } from './create-product-types.component';

describe('CreateProductTypesComponent', () => {
  let component: CreateProductTypesComponent;
  let fixture: ComponentFixture<CreateProductTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProductTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

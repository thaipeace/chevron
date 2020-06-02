import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderImportProductMappingComponent } from './create-order-import-product-mapping.component';

describe('CreateOrderImportProductMappingComponent', () => {
  let component: CreateOrderImportProductMappingComponent;
  let fixture: ComponentFixture<CreateOrderImportProductMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrderImportProductMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderImportProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

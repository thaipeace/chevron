import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderImportProductMappingComponent } from './order-import-product-mapping.component';

describe('OrderImportProductMappingComponent', () => {
  let component: OrderImportProductMappingComponent;
  let fixture: ComponentFixture<OrderImportProductMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderImportProductMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderImportProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

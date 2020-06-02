import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderImportProductMappingComponent } from './edit-order-import-product-mapping.component';

describe('EditOrderImportProductMappingComponent', () => {
  let component: EditOrderImportProductMappingComponent;
  let fixture: ComponentFixture<EditOrderImportProductMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrderImportProductMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrderImportProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

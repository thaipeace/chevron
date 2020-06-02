import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseProductTypesComponent } from './base-product-types.component';

describe('BaseProductTypesComponent', () => {
  let component: BaseProductTypesComponent;
  let fixture: ComponentFixture<BaseProductTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseProductTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCurrentComponent } from './inventory-current.component';

describe('InventoryCurrentComponent', () => {
  let component: InventoryCurrentComponent;
  let fixture: ComponentFixture<InventoryCurrentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCurrentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedInventoryHintDialogComponent } from './estimated-inventory-hint-dialog.component';

describe('EstimatedInventoryHintDialogComponent', () => {
  let component: EstimatedInventoryHintDialogComponent;
  let fixture: ComponentFixture<EstimatedInventoryHintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimatedInventoryHintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedInventoryHintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

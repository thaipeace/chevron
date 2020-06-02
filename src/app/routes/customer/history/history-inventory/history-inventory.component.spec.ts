import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryInventoryComponent } from './history-inventory.component';

describe('HistoryInventoryComponent', () => {
  let component: HistoryInventoryComponent;
  let fixture: ComponentFixture<HistoryInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

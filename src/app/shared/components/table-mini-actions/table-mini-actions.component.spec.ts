import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMiniActionsComponent } from './table-mini-actions.component';

describe('TableMiniActionsComponent', () => {
  let component: TableMiniActionsComponent;
  let fixture: ComponentFixture<TableMiniActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMiniActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMiniActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

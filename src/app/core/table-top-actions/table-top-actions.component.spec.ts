import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTopActionsComponent } from './table-top-actions.component';

describe('TableTopActionsComponent', () => {
  let component: TableTopActionsComponent;
  let fixture: ComponentFixture<TableTopActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTopActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTopActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

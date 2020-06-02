import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSelectAdvanceComponent } from './table-select-advance.component';

describe('TableSelectAdvanceComponent', () => {
  let component: TableSelectAdvanceComponent;
  let fixture: ComponentFixture<TableSelectAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSelectAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSelectAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

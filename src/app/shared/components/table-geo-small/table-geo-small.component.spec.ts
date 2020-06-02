import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGeoSmallComponent } from './table-geo-small.component';

describe('TableGeoSmallComponent', () => {
  let component: TableGeoSmallComponent;
  let fixture: ComponentFixture<TableGeoSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableGeoSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableGeoSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

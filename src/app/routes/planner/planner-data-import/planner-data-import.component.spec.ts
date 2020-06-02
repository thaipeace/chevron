import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerDataImportComponent } from './planner-data-import.component';

describe('PlannerDataImportComponent', () => {
  let component: PlannerDataImportComponent;
  let fixture: ComponentFixture<PlannerDataImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerDataImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

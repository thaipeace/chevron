import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePlannerDetailsDialogComponent } from './role-planner-details-dialog.component';

describe('RolePlannerDetailsDialogComponent', () => {
  let component: RolePlannerDetailsDialogComponent;
  let fixture: ComponentFixture<RolePlannerDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePlannerDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePlannerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

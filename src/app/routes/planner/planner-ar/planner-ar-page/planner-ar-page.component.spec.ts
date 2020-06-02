import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerArPageComponent } from './planner-ar-page.component';

describe('PlannerArPageComponent', () => {
  let component: PlannerArPageComponent;
  let fixture: ComponentFixture<PlannerArPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerArPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerArPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

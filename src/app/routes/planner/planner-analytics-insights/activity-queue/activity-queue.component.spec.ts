import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityQueueComponent } from './activity-queue.component';

describe('ActivityQueueComponent', () => {
  let component: ActivityQueueComponent;
  let fixture: ComponentFixture<ActivityQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

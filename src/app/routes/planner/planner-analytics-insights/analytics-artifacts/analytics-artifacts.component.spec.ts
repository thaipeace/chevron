import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsArtifactsComponent } from './analytics-artifacts.component';

describe('AnalyticsArtifactsComponent', () => {
  let component: AnalyticsArtifactsComponent;
  let fixture: ComponentFixture<AnalyticsArtifactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsArtifactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsArtifactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

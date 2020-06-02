import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmRouteDetailsCompactComponent } from './cm-route-details-compact.component';

describe('CmRouteDetailsCompactComponent', () => {
  let component: CmRouteDetailsCompactComponent;
  let fixture: ComponentFixture<CmRouteDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmRouteDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmRouteDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

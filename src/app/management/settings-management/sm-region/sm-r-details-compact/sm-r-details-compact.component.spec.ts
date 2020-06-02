import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmRDetailsCompactComponent } from './sm-r-details-compact.component';

describe('SmRDetailsCompactComponent', () => {
  let component: SmRDetailsCompactComponent;
  let fixture: ComponentFixture<SmRDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmRDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmRDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

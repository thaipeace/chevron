import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmSpDetailsCompactComponent } from './sm-sp-details-compact.component';

describe('SmSpDetailsCompactComponent', () => {
  let component: SmSpDetailsCompactComponent;
  let fixture: ComponentFixture<SmSpDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmSpDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmSpDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTpDetailsCompactComponent } from './sm-tp-details-compact.component';

describe('SmTpDetailsCompactComponent', () => {
  let component: SmTpDetailsCompactComponent;
  let fixture: ComponentFixture<SmTpDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTpDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTpDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHdDetailsCompactComponent } from './sm-hd-details-compact.component';

describe('SmHdDetailsCompactComponent', () => {
  let component: SmHdDetailsCompactComponent;
  let fixture: ComponentFixture<SmHdDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHdDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHdDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmHlDetailsCompactComponent } from './sm-hl-details-compact.component';

describe('SmHlDetailsCompactComponent', () => {
  let component: SmHlDetailsCompactComponent;
  let fixture: ComponentFixture<SmHlDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmHlDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmHlDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

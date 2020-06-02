import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmTDetailsCompactComponent } from './sm-t-details-compact.component';

describe('SmTDetailsCompactComponent', () => {
  let component: SmTDetailsCompactComponent;
  let fixture: ComponentFixture<SmTDetailsCompactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmTDetailsCompactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmTDetailsCompactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
